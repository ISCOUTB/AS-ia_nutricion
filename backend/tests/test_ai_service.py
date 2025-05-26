import pytest
import pandas as pd
import numpy as np
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi.testclient import TestClient
from fastapi import HTTPException

# Imports de los módulos a testear
from src.ai.ai_models import EstadoNutricionalInput, VALID_NUTRITIONAL_STATES, VALID_MODELS
from src.ai.ai_service import (
    predecir_estado_nutricional,
    guardar_resultado_clasificacion,
    preprocess_input,
    obtener_historial_clasificaciones
)
from src.ai.ai_routes import ai_router
from src.ai.model_loader import load_model, load_label_encoder


class TestAIModels:
    """Tests para ai_models.py"""
    
    def test_estado_nutricional_input_valid_data(self):
        """Test con datos válidos"""
        valid_data = {
            "location_type": "urbano",
            "caregiver_education_level": "secundaria",
            "monthly_income": 500.0,
            "food_security": "seguro",
            "water_access": True,
            "enfermedades": 0,
            "medicamentos": False,
            "alergias": 1,
            "antecedentes_familiares": True,
            "consumo_frutas": 1,
            "consumo_verduras": 0,
            "actividad_fisica": True,
            "tiempo_pantalla": 2.5,
            "peso": 25.5,
            "talla": 120.0,
            "imc": 17.7
        }
        
        model = EstadoNutricionalInput(**valid_data)
        assert model.location_type == "urbano"
        assert model.caregiver_education_level == "secundaria"
        assert model.monthly_income == 500.0
        assert model.water_access == True
        assert model.enfermedades == 0
        assert model.medicamentos == False

    def test_location_type_validation(self):
        """Test validación de location_type"""
        base_data = self._get_base_valid_data()
        
        # Casos válidos
        for location in ['urbano', 'rural', 'semiurbano', 'URBANO', ' Rural ']:
            data = {**base_data, "location_type": location}
            model = EstadoNutricionalInput(**data)
            assert model.location_type in ['urbano', 'rural', 'semiurbano']
        
        # Caso inválido
        with pytest.raises(ValueError, match="location_type debe ser uno de"):
            invalid_data = {**base_data, "location_type": "invalid"}
            EstadoNutricionalInput(**invalid_data)

    def test_education_level_validation(self):
        """Test validación de caregiver_education_level"""
        base_data = self._get_base_valid_data()
        
        # Casos válidos
        valid_levels = ['sin_educacion', 'primaria', 'secundaria', 'tecnica', 'universitaria', 'posgrado']
        for level in valid_levels:
            data = {**base_data, "caregiver_education_level": level}
            model = EstadoNutricionalInput(**data)
            assert model.caregiver_education_level == level
        
        # Caso inválido
        with pytest.raises(ValueError, match="caregiver_education_level debe ser uno de"):
            invalid_data = {**base_data, "caregiver_education_level": "invalid"}
            EstadoNutricionalInput(**invalid_data)

    def test_food_security_validation(self):
        """Test validación de food_security"""
        base_data = self._get_base_valid_data()
        
        # Casos válidos
        for security in ['seguro', 'leve', 'moderado', 'severo']:
            data = {**base_data, "food_security": security}
            model = EstadoNutricionalInput(**data)
            assert model.food_security == security
        
        # Caso inválido
        with pytest.raises(ValueError, match="food_security debe ser uno de"):
            invalid_data = {**base_data, "food_security": "invalid"}
            EstadoNutricionalInput(**invalid_data)

    def test_binary_fields_validation(self):
        """Test validación de campos binarios"""
        base_data = self._get_base_valid_data()
        binary_fields = [
            'enfermedades', 'medicamentos', 'alergias', 'antecedentes_familiares',
            'consumo_frutas', 'consumo_verduras', 'actividad_fisica', 'water_access'
        ]
        
        for field in binary_fields:
            # Casos válidos
            for value in [0, 1, True, False]:
                data = {**base_data, field: value}
                model = EstadoNutricionalInput(**data)
                assert hasattr(model, field)
            
            # Casos inválidos
            for invalid_value in [2, -1, "yes", None]:
                with pytest.raises(ValueError, match="Los campos binarios deben ser"):
                    invalid_data = {**base_data, field: invalid_value}
                    EstadoNutricionalInput(**invalid_data)

    def test_numeric_field_validation(self):
        """Test validación de campos numéricos"""
        base_data = self._get_base_valid_data()
        
        # monthly_income >= 0
        with pytest.raises(ValueError):
            invalid_data = {**base_data, "monthly_income": -100}
            EstadoNutricionalInput(**invalid_data)
        
        # tiempo_pantalla >= 0
        with pytest.raises(ValueError):
            invalid_data = {**base_data, "tiempo_pantalla": -1.5}
            EstadoNutricionalInput(**invalid_data)
        
        # peso > 0
        with pytest.raises(ValueError):
            invalid_data = {**base_data, "peso": 0}
            EstadoNutricionalInput(**invalid_data)
        
        # talla > 0
        with pytest.raises(ValueError):
            invalid_data = {**base_data, "talla": -10}
            EstadoNutricionalInput(**invalid_data)
        
        # imc > 0
        with pytest.raises(ValueError):
            invalid_data = {**base_data, "imc": 0}
            EstadoNutricionalInput(**invalid_data)

    def test_constants(self):
        """Test constantes definidas"""
        assert len(VALID_NUTRITIONAL_STATES) == 6
        assert 'normal' in VALID_NUTRITIONAL_STATES
        assert 'desnutricion_aguda_severa' in VALID_NUTRITIONAL_STATES
        
        assert len(VALID_MODELS) == 4
        assert 'random_forest_v1' in VALID_MODELS

    def _get_base_valid_data(self):
        """Datos base válidos para tests"""
        return {
            "location_type": "urbano",
            "caregiver_education_level": "secundaria",
            "monthly_income": 500.0,
            "food_security": "seguro",
            "water_access": True,
            "enfermedades": 0,
            "medicamentos": False,
            "alergias": 1,
            "antecedentes_familiares": True,
            "consumo_frutas": 1,
            "consumo_verduras": 0,
            "actividad_fisica": True,
            "tiempo_pantalla": 2.5,
            "peso": 25.5,
            "talla": 120.0,
            "imc": 17.7
        }


class TestModelLoader:
    """Tests para model_loader.py"""
    
    @patch('src.ai.model_loader.joblib.load')
    @patch('src.ai.model_loader.os.path.join')
    def test_load_model_success(self, mock_join, mock_joblib_load):
        """Test carga exitosa del modelo"""
        mock_model = Mock()
        mock_joblib_load.return_value = mock_model
        mock_join.return_value = "/fake/path/modelo.pkl"
        
        result = load_model()
        
        assert result == mock_model
        mock_joblib_load.assert_called_once()

    @patch('src.ai.model_loader.joblib.load')
    @patch('src.ai.model_loader.os.path.join')
    def test_load_label_encoder_success(self, mock_join, mock_joblib_load):
        """Test carga exitosa del label encoder"""
        mock_encoder = Mock()
        mock_joblib_load.return_value = mock_encoder
        mock_join.return_value = "/fake/path/encoder.pkl"
        
        result = load_label_encoder()
        
        assert result == mock_encoder
        mock_joblib_load.assert_called_once()

    @patch('src.ai.model_loader.joblib.load')
    def test_load_model_file_not_found(self, mock_joblib_load):
        """Test error cuando no se encuentra el archivo del modelo"""
        mock_joblib_load.side_effect = FileNotFoundError("File not found")
        
        with pytest.raises(FileNotFoundError):
            load_model()


class TestAIService:
    """Tests para ai_service.py"""
    
    def setup_method(self):
        """Setup para cada test"""
        self.mock_model = Mock()
        self.mock_encoder = Mock()
        self.child_id = str(ObjectId())
        
    @patch('src.ai.ai_service.db')
    @patch('src.ai.ai_service.model')
    @patch('src.ai.ai_service.label_encoder')
    def test_predecir_estado_nutricional_success(self, mock_encoder, mock_model, mock_db):
        """Test predicción exitosa"""
        # Setup mocks
        mock_model.predict.return_value = np.array([1])
        mock_model.predict_proba.return_value = np.array([[0.1, 0.8, 0.1]])
        mock_encoder.inverse_transform.return_value = ['normal']
        
        mock_child = {"_id": ObjectId(self.child_id), "name": "Test Child"}
        mock_db.children.find_one.return_value = mock_child
        mock_db.classification_results.insert_one.return_value = Mock(inserted_id=ObjectId())
        
        data_dict = {"peso": 25.5, "talla": 120.0, "imc": 17.7}
        
        result = predecir_estado_nutricional(data_dict, self.child_id, save_to_db=True)
        
        assert result["estado_nutricional"] == "normal"
        assert result["confidence_score"] == 0.8
        assert result["modelo"] == "random_forest_v1"
        assert result["child_id"] == self.child_id
        assert "classification_id" in result

    @patch('src.ai.ai_service.db')
    @patch('src.ai.ai_service.model')
    @patch('src.ai.ai_service.label_encoder')
    def test_predecir_estado_nutricional_no_save(self, mock_encoder, mock_model, mock_db):
        """Test predicción sin guardar en BD"""
        mock_model.predict.return_value = np.array([0])
        mock_model.predict_proba.return_value = np.array([[0.9, 0.1]])
        mock_encoder.inverse_transform.return_value = ['desnutricion_aguda_severa']
        
        data_dict = {"peso": 15.0, "talla": 100.0, "imc": 15.0}
        
        result = predecir_estado_nutricional(data_dict, self.child_id, save_to_db=False)
        
        assert result["estado_nutricional"] == "desnutricion_aguda_severa"
        assert result["confidence_score"] == 0.9
        assert "classification_id" not in result
        mock_db.classification_results.insert_one.assert_not_called()

    @patch('src.ai.ai_service.db')
    @patch('src.ai.ai_service.model') 
    @patch('src.ai.ai_service.label_encoder')
    def test_predecir_estado_nutricional_db_error(self, mock_encoder, mock_model, mock_db):
        """Test predicción con error en BD"""
        mock_model.predict.return_value = np.array([1])
        mock_model.predict_proba.return_value = np.array([[0.2, 0.7, 0.1]])
        mock_encoder.inverse_transform.return_value = ['normal']
        
        mock_db.children.find_one.side_effect = Exception("DB Error")
        
        data_dict = {"peso": 25.5, "talla": 120.0, "imc": 17.7}
        
        result = predecir_estado_nutricional(data_dict, self.child_id, save_to_db=True)
        
        assert result["estado_nutricional"] == "normal"
        assert "db_error" in result
        assert "DB Error" in result["db_error"]

    @patch('src.ai.ai_service.db')
    def test_guardar_resultado_clasificacion_success(self, mock_db):
        """Test guardado exitoso de resultado"""
        mock_child = {"_id": ObjectId(self.child_id)}
        mock_db.children.find_one.return_value = mock_child
        
        inserted_id = ObjectId()
        mock_db.classification_results.insert_one.return_value = Mock(inserted_id=inserted_id)
        
        result_id = guardar_resultado_clasificacion(
            child_id=self.child_id,
            resultado="normal",
            confidence_score=0.85,
            modelo="random_forest_v1"
        )
        
        assert result_id == inserted_id
        mock_db.classification_results.insert_one.assert_called_once()

    @patch('src.ai.ai_service.db')
    def test_guardar_resultado_clasificacion_child_not_found(self, mock_db):
        """Test error cuando el niño no existe"""
        mock_db.children.find_one.return_value = None
        
        with pytest.raises(ValueError, match="No existe un niño con ID"):
            guardar_resultado_clasificacion(
                child_id=self.child_id,
                resultado="normal",
                confidence_score=0.85,
                modelo="random_forest_v1"
            )

    def test_preprocess_input_success(self):
        """Test preprocesamiento exitoso"""
        input_data = EstadoNutricionalInput(
            location_type="urbano",
            caregiver_education_level="secundaria",
            monthly_income=500.0,
            food_security="seguro",
            water_access=True,
            enfermedades=False,
            medicamentos=1,
            alergias=0,
            antecedentes_familiares=True,
            consumo_frutas=1,
            consumo_verduras=False,
            actividad_fisica=True,
            tiempo_pantalla=2.5,
            peso=25.5,
            talla=120.0,
            imc=17.7
        )
        
        result = preprocess_input(input_data)
        
        assert result["water_access"] == 1  # True -> 1
        assert result["enfermedades"] == 0  # False -> 0
        assert result["medicamentos"] == 1  # ya era 1
        assert result["consumo_verduras"] == 0  # False -> 0

    def test_preprocess_input_invalid_binary_value(self):
        """Test error con valor binario inválido"""
        # Crear mock de input con valor inválido
        mock_input = Mock()
        mock_input.model_dump.return_value = {
            "location_type": "urbano",
            "enfermedades": 5,  # Valor inválido
            "water_access": True
        }
        
        with pytest.raises(ValueError, match="debe ser 0 o 1 si es int"):
            preprocess_input(mock_input)

    def test_preprocess_input_invalid_type(self):
        """Test error con tipo inválido"""
        mock_input = Mock()
        mock_input.model_dump.return_value = {
            "location_type": "urbano",
            "enfermedades": "yes",  # Tipo inválido
            "water_access": True
        }
        
        with pytest.raises(ValueError, match="debe ser int o bool"):
            preprocess_input(mock_input)

    @patch('src.ai.ai_service.db')
    def test_obtener_historial_clasificaciones_success(self, mock_db):
        """Test obtención exitosa del historial"""
        mock_results = [
            {
                "_id": ObjectId(),
                "child_id": ObjectId(self.child_id),
                "resultado": "normal",
                "modelo": "random_forest_v1",
                "fecha_resultado": datetime.now(timezone.utc),
                "confidence_score": 0.85
            }
        ]
        
        mock_cursor = Mock()
        mock_cursor.sort.return_value.limit.return_value = mock_results
        mock_db.classification_results.find.return_value = mock_cursor
        
        result = obtener_historial_clasificaciones(self.child_id, limit=5)
        
        assert len(result) == 1
        assert isinstance(result[0]["_id"], str)
        assert isinstance(result[0]["child_id"], str)

    @patch('src.ai.ai_service.db')
    def test_obtener_historial_clasificaciones_error(self, mock_db):
        """Test error al obtener historial"""
        mock_db.classification_results.find.side_effect = Exception("DB Error")
        
        result = obtener_historial_clasificaciones(self.child_id)
        
        assert result == []


class TestAIRoutes:
    """Tests para ai_routes.py"""
    
    def setup_method(self):
        """Setup para cada test"""
        self.client = TestClient(ai_router)
        self.child_id = str(ObjectId())
        self.valid_input = {
            "location_type": "urbano",
            "caregiver_education_level": "secundaria",
            "monthly_income": 500.0,
            "food_security": "seguro",
            "water_access": True,
            "enfermedades": 0,
            "medicamentos": False,
            "alergias": 1,
            "antecedentes_familiares": True,
            "consumo_frutas": 1,
            "consumo_verduras": 0,
            "actividad_fisica": True,
            "tiempo_pantalla": 2.5,
            "peso": 25.5,
            "talla": 120.0,
            "imc": 17.7
        }

    @patch('src.ai.ai_routes.predecir_estado_nutricional')
    @patch('src.ai.ai_routes.preprocess_input')
    def test_predecir_estado_success(self, mock_preprocess, mock_predict):
        """Test endpoint de predicción exitoso"""
        mock_preprocess.return_value = self.valid_input
        mock_predict.return_value = {
            "estado_nutricional": "normal",
            "confidence_score": 0.85,
            "modelo": "random_forest_v1",
            "child_id": self.child_id,
            "classification_id": str(ObjectId())
        }
        
        response = self.client.post(
            f"/predecir-estado/{self.child_id}",
            json=self.valid_input
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["estado_nutricional"] == "normal"
        assert "classification_id" in data["data"]

    def test_predecir_estado_invalid_child_id(self):
        """Test endpoint con child_id inválido"""
        response = self.client.post(
            "/predecir-estado/invalid_id",
            json=self.valid_input
        )
        
        assert response.status_code == 400
        assert "ID de niño no válido" in response.json()["detail"]

    @patch('src.ai.ai_routes.preprocess_input')
    def test_predecir_estado_validation_error(self, mock_preprocess):
        """Test endpoint con error de validación"""
        mock_preprocess.side_effect = ValueError("Campo inválido")
        
        response = self.client.post(
            f"/predecir-estado/{self.child_id}",
            json=self.valid_input
        )
        
        assert response.status_code == 400
        assert "Campo inválido" in response.json()["detail"]

    @patch('src.ai.ai_routes.predecir_estado_nutricional')
    @patch('src.ai.ai_routes.preprocess_input')
    def test_predecir_estado_internal_error(self, mock_preprocess, mock_predict):
        """Test endpoint con error interno"""
        mock_preprocess.return_value = self.valid_input
        mock_predict.side_effect = Exception("Error interno")
        
        response = self.client.post(
            f"/predecir-estado/{self.child_id}",
            json=self.valid_input
        )
        
        assert response.status_code == 500
        assert "Error interno del servidor" in response.json()["detail"]

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_historial_success(self, mock_historial):
        """Test endpoint de historial exitoso"""
        mock_historial.return_value = [
            {
                "_id": str(ObjectId()),
                "child_id": self.child_id,
                "resultado": "normal",
                "modelo": "random_forest_v1",
                "fecha_resultado": datetime.now(timezone.utc),
                "confidence_score": 0.85
            }
        ]
        
        response = self.client.get(f"/historial/{self.child_id}?limit=5")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["total_resultados"] == 1
        assert len(data["data"]["historial"]) == 1

    def test_obtener_historial_invalid_child_id(self):
        """Test historial con child_id inválido"""
        response = self.client.get("/historial/invalid_id")
        
        assert response.status_code == 400
        assert "ID de niño no válido" in response.json()["detail"]

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_historial_internal_error(self, mock_historial):
        """Test historial con error interno"""
        mock_historial.side_effect = Exception("Error interno")
        
        response = self.client.get(f"/historial/{self.child_id}")
        
        assert response.status_code == 500
        assert "Error interno del servidor" in response.json()["detail"]

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_estadisticas_success(self, mock_historial):
        """Test endpoint de estadísticas exitoso"""
        mock_data = [
            {
                "resultado": "normal",
                "confidence_score": 0.85,
                "fecha_resultado": datetime.now(timezone.utc)
            },
            {
                "resultado": "normal", 
                "confidence_score": 0.90,
                "fecha_resultado": datetime.now(timezone.utc)
            },
            {
                "resultado": "sobrepeso",
                "confidence_score": 0.75,
                "fecha_resultado": datetime.now(timezone.utc)
            }
        ]
        mock_historial.return_value = mock_data
        
        response = self.client.get(f"/estadisticas/{self.child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["total_predicciones"] == 3
        assert data["data"]["estadisticas"]["resultado_mas_frecuente"] == "normal"
        assert data["data"]["estadisticas"]["confidence_promedio"] == 0.833

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_estadisticas_empty_history(self, mock_historial):
        """Test estadísticas con historial vacío"""
        mock_historial.return_value = []
        
        response = self.client.get(f"/estadisticas/{self.child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["total_predicciones"] == 0
        assert data["message"] == "No hay predicciones para este niño"

    def test_obtener_estadisticas_invalid_child_id(self):
        """Test estadísticas con child_id inválido"""
        response = self.client.get("/estadisticas/invalid_id")
        
        assert response.status_code == 400
        assert "ID de niño no válido" in response.json()["detail"]

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_estadisticas_internal_error(self, mock_historial):
        """Test estadísticas con error interno"""
        mock_historial.side_effect = Exception("Error interno")
        
        response = self.client.get(f"/estadisticas/{self.child_id}")
        
        assert response.status_code == 500
        assert "Error interno del servidor" in response.json()["detail"]


# Configuración para pytest
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=src.ai", "--cov-report=html"])