import pytest
from unittest.mock import Mock, patch, MagicMock
from bson import ObjectId
from bson.errors import InvalidId
from datetime import date, timedelta
from typing import List

# Importar los módulos a testear
from backend.src.measurements.measurement_service import (
    create_measurement,
    get_all_measurements,
    get_measurements_by_child,
    get_measurement_by_id,
    update_measurement,
    delete_measurement,
    get_latest_measurement_by_child,
    measurements_collection
)
from backend.src.measurements.measurement_models import (
    Measurement, 
    MeasurementCreate,
    PyObjectId
)

class TestMeasurementModels:
    """Pruebas para los modelos de Pydantic"""
    
    def test_measurement_create_valid_data(self):
        """Test de creación de medición con datos válidos"""
        child_id = ObjectId()
        measurement_data = {
            "child_id": child_id,
            "peso": 25.5,
            "talla": 120.0,
            "fecha_medicion": date.today()
        }
        
        measurement = MeasurementCreate(**measurement_data)
        assert measurement.child_id == child_id
        assert measurement.peso == 25.5
        assert measurement.talla == 120.0
        assert measurement.fecha_medicion == date.today()
    
    def test_measurement_create_invalid_peso(self):
        """Test de validación de peso inválido"""
        child_id = ObjectId()
        
        # Peso negativo
        with pytest.raises(ValueError, match="El peso debe ser mayor a 0"):
            MeasurementCreate(
                child_id=child_id,
                peso=-5.0,
                talla=120.0,
                fecha_medicion=date.today()
            )
        
        # Peso cero
        with pytest.raises(ValueError, match="El peso debe ser mayor a 0"):
            MeasurementCreate(
                child_id=child_id,
                peso=0,
                talla=120.0,
                fecha_medicion=date.today()
            )
        
        # Peso excesivo
        with pytest.raises(ValueError, match="El peso parece excesivo para un niño"):
            MeasurementCreate(
                child_id=child_id,
                peso=250.0,
                talla=120.0,
                fecha_medicion=date.today()
            )
    
    def test_measurement_create_invalid_talla(self):
        """Test de validación de talla inválida"""
        child_id = ObjectId()
        
        # Talla negativa
        with pytest.raises(ValueError, match="La talla debe ser mayor a 0"):
            MeasurementCreate(
                child_id=child_id,
                peso=25.0,
                talla=-10.0,
                fecha_medicion=date.today()
            )
        
        # Talla cero
        with pytest.raises(ValueError, match="La talla debe ser mayor a 0"):
            MeasurementCreate(
                child_id=child_id,
                peso=25.0,
                talla=0,
                fecha_medicion=date.today()
            )
        
        # Talla excesiva
        with pytest.raises(ValueError, match="La talla parece excesiva para un niño"):
            MeasurementCreate(
                child_id=child_id,
                peso=25.0,
                talla=300.0,
                fecha_medicion=date.today()
            )
    
    def test_measurement_create_invalid_fecha(self):
        """Test de validación de fecha futura"""
        child_id = ObjectId()
        future_date = date.today() + timedelta(days=1)
        
        with pytest.raises(ValueError, match="La fecha de medición no puede ser futura"):
            MeasurementCreate(
                child_id=child_id,
                peso=25.0,
                talla=120.0,
                fecha_medicion=future_date
            )
    
    def test_measurement_imc_calculation(self):
        """Test del cálculo automático de IMC"""
        child_id = ObjectId()
        measurement_data = {
            "_id": str(ObjectId()),
            "child_id": child_id,
            "peso": 25.0,  # kg
            "talla": 125.0,  # cm
            "fecha_medicion": date.today()
        }
        
        measurement = Measurement(**measurement_data)
        # IMC = peso / (talla_m^2) = 25 / (1.25^2) = 25 / 1.5625 = 16.0
        assert measurement.imc == 16.0
    
    def test_py_object_id_validation(self):
        """Test del validador PyObjectId"""
        # ObjectId válido
        valid_id = ObjectId()
        result = PyObjectId.validate(valid_id)
        assert result == valid_id
        
        # String de ObjectId válido
        valid_str = str(ObjectId())
        result = PyObjectId.validate(valid_str)
        assert isinstance(result, ObjectId)
        
        # ObjectId inválido
        with pytest.raises(ValueError, match="Invalid ObjectId"):
            PyObjectId.validate("invalid_id")


class TestMeasurementService:
    """Pruebas para el servicio de mediciones"""
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_create_measurement_success(self, mock_collection):
        """Test de creación exitosa de medición"""
        # Configurar mock
        mock_result = Mock()
        mock_result.inserted_id = ObjectId()
        mock_collection.insert_one.return_value = mock_result
        
        # Datos de prueba
        child_id = ObjectId()
        measurement_data = MeasurementCreate(
            child_id=child_id,
            peso=25.0,
            talla=120.0,
            fecha_medicion=date.today()
        )
        
        # Ejecutar función
        result_id = create_measurement(measurement_data)
        
        # Verificar
        assert result_id == str(mock_result.inserted_id)
        mock_collection.insert_one.assert_called_once()
        
        # Verificar que los datos incluyen IMC calculado
        call_args = mock_collection.insert_one.call_args[0][0]
        assert "imc" in call_args
        assert call_args["imc"] == 17.36  # 25 / (1.2^2)
        assert isinstance(call_args["child_id"], ObjectId)
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_create_measurement_exception(self, mock_collection):
        """Test de manejo de excepción al crear medición"""
        # Configurar mock para lanzar excepción
        mock_collection.insert_one.side_effect = Exception("Database error")
        
        child_id = ObjectId()
        measurement_data = MeasurementCreate(
            child_id=child_id,
            peso=25.0,
            talla=120.0,
            fecha_medicion=date.today()
        )
        
        # Verificar que se re-lanza la excepción
        with pytest.raises(Exception, match="Database error"):
            create_measurement(measurement_data)
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_all_measurements_success(self, mock_collection):
        """Test de obtención exitosa de todas las mediciones"""
        # Configurar mock data
        mock_docs = [
            {
                "_id": ObjectId(),
                "child_id": ObjectId(),
                "peso": 25.0,
                "talla": 120.0,
                "imc": 17.36,
                "fecha_medicion": date.today()
            },
            {
                "_id": ObjectId(),
                "child_id": ObjectId(),
                "peso": 30.0,
                "talla": 130.0,
                "imc": 17.75,
                "fecha_medicion": date.today()
            }
        ]
        
        mock_collection.find.return_value = mock_docs
        
        # Ejecutar función
        result = get_all_measurements()
        
        # Verificar
        assert len(result) == 2
        assert all(isinstance(m, Measurement) for m in result)
        mock_collection.find.assert_called_once()
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_all_measurements_with_invalid_doc(self, mock_collection):
        """Test de obtención con documento inválido (debe omitirse)"""
        # Configurar mock con un documento válido y uno inválido
        mock_docs = [
            {
                "_id": ObjectId(),
                "child_id": ObjectId(),
                "peso": 25.0,
                "talla": 120.0,
                "imc": 17.36,
                "fecha_medicion": date.today()
            },
            {
                "_id": ObjectId(),
                "child_id": ObjectId(),
                "peso": -5.0,  # Peso inválido
                "talla": 120.0,
                "fecha_medicion": date.today()
            }
        ]
        
        mock_collection.find.return_value = mock_docs
        
        # Ejecutar función
        result = get_all_measurements()
        
        # Verificar que solo se devuelve el documento válido
        assert len(result) == 1
        assert result[0].peso == 25.0
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_all_measurements_exception(self, mock_collection):
        """Test de manejo de excepción al obtener todas las mediciones"""
        mock_collection.find.side_effect = Exception("Database error")
        
        with pytest.raises(Exception, match="Database error"):
            get_all_measurements()
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_measurements_by_child_success(self, mock_collection):
        """Test de obtención exitosa de mediciones por niño"""
        child_id = ObjectId()
        mock_docs = [
            {
                "_id": ObjectId(),
                "child_id": child_id,
                "peso": 25.0,
                "talla": 120.0,
                "imc": 17.36,
                "fecha_medicion": date.today()
            }
        ]
        
        mock_collection.find.return_value = mock_docs
        
        # Ejecutar función
        result = get_measurements_by_child(str(child_id))
        
        # Verificar
        assert len(result) == 1
        assert isinstance(result[0], Measurement)
        mock_collection.find.assert_called_once_with({"child_id": child_id})
    
    def test_get_measurements_by_child_invalid_id(self):
        """Test de ID de niño inválido"""
        with pytest.raises(ValueError, match="ID de niño inválido"):
            get_measurements_by_child("invalid_id")
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_measurements_by_child_exception(self, mock_collection):
        """Test de manejo de excepción al obtener mediciones por niño"""
        mock_collection.find.side_effect = Exception("Database error")
        child_id = str(ObjectId())
        
        with pytest.raises(Exception, match="Database error"):
            get_measurements_by_child(child_id)
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_measurement_by_id_success(self, mock_collection):
        """Test de obtención exitosa de medición por ID"""
        measurement_id = ObjectId()
        mock_doc = {
            "_id": measurement_id,
            "child_id": ObjectId(),
            "peso": 25.0,
            "talla": 120.0,
            "imc": 17.36,
            "fecha_medicion": date.today()
        }
        
        mock_collection.find_one.return_value = mock_doc
        
        # Ejecutar función
        result = get_measurement_by_id(str(measurement_id))
        
        # Verificar
        assert isinstance(result, Measurement)
        assert result.peso == 25.0
        mock_collection.find_one.assert_called_once_with({"_id": measurement_id})
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_measurement_by_id_not_found(self, mock_collection):
        """Test de medición no encontrada"""
        mock_collection.find_one.return_value = None
        measurement_id = str(ObjectId())
        
        result = get_measurement_by_id(measurement_id)
        assert result is None
    
    def test_get_measurement_by_id_invalid_id(self):
        """Test de ID de medición inválido"""
        with pytest.raises(ValueError, match="ID de medición inválido"):
            get_measurement_by_id("invalid_id")
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_update_measurement_success(self, mock_collection):
        """Test de actualización exitosa de medición"""
        measurement_id = ObjectId()
        
        # Mock para find_one (medición actual)
        current_doc = {
            "_id": measurement_id,
            "child_id": ObjectId(),
            "peso": 25.0,
            "talla": 120.0,
            "imc": 17.36,
            "fecha_medicion": date.today()
        }
        mock_collection.find_one.return_value = current_doc
        
        # Mock para update_one
        mock_result = Mock()
        mock_result.modified_count = 1
        mock_collection.update_one.return_value = mock_result
        
        # Datos de actualización
        update_data = {"peso": 26.0}
        
        # Ejecutar función
        result = update_measurement(str(measurement_id), update_data)
        
        # Verificar
        assert result is True
        mock_collection.update_one.assert_called_once()
        
        # Verificar que se recalculó el IMC
        call_args = mock_collection.update_one.call_args[0][1]["$set"]
        assert "imc" in call_args
        assert call_args["peso"] == 26.0
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_update_measurement_not_found(self, mock_collection):
        """Test de actualización de medición no encontrada"""
        measurement_id = ObjectId()
        mock_collection.find_one.return_value = None
        
        update_data = {"peso": 26.0}
        result = update_measurement(str(measurement_id), update_data)
        
        assert result is False
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_update_measurement_no_changes(self, mock_collection):
        """Test de actualización sin cambios"""
        measurement_id = ObjectId()
        
        # Mock para find_one
        current_doc = {
            "_id": measurement_id,
            "child_id": ObjectId(),
            "peso": 25.0,
            "talla": 120.0,
            "imc": 17.36,
            "fecha_medicion": date.today()
        }
        mock_collection.find_one.return_value = current_doc
        
        # Mock para update_one (sin modificaciones)
        mock_result = Mock()
        mock_result.modified_count = 0
        mock_collection.update_one.return_value = mock_result
        
        update_data = {"peso": 25.0}  # Mismo valor
        result = update_measurement(str(measurement_id), update_data)
        
        assert result is False
    
    def test_update_measurement_invalid_id(self):
        """Test de actualización con ID inválido"""
        with pytest.raises(ValueError, match="ID de medición inválido"):
            update_measurement("invalid_id", {"peso": 26.0})
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_delete_measurement_success(self, mock_collection):
        """Test de eliminación exitosa de medición"""
        measurement_id = ObjectId()
        
        mock_result = Mock()
        mock_result.deleted_count = 1
        mock_collection.delete_one.return_value = mock_result
        
        result = delete_measurement(str(measurement_id))
        
        assert result is True
        mock_collection.delete_one.assert_called_once_with({"_id": measurement_id})
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_delete_measurement_not_found(self, mock_collection):
        """Test de eliminación de medición no encontrada"""
        measurement_id = ObjectId()
        
        mock_result = Mock()
        mock_result.deleted_count = 0
        mock_collection.delete_one.return_value = mock_result
        
        result = delete_measurement(str(measurement_id))
        
        assert result is False
    
    def test_delete_measurement_invalid_id(self):
        """Test de eliminación con ID inválido"""
        with pytest.raises(ValueError, match="ID de medición inválido"):
            delete_measurement("invalid_id")
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_latest_measurement_by_child_success(self, mock_collection):
        """Test de obtención exitosa de la última medición de un niño"""
        child_id = ObjectId()
        mock_doc = {
            "_id": ObjectId(),
            "child_id": child_id,
            "peso": 25.0,
            "talla": 120.0,
            "imc": 17.36,
            "fecha_medicion": date.today()
        }
        
        mock_collection.find_one.return_value = mock_doc
        
        result = get_latest_measurement_by_child(str(child_id))
        
        assert isinstance(result, Measurement)
        mock_collection.find_one.assert_called_once_with(
            {"child_id": child_id},
            sort=[("fecha_medicion", -1)]
        )
    
    @patch('backend.src.measurements.measurement_service.measurements_collection')
    def test_get_latest_measurement_by_child_not_found(self, mock_collection):
        """Test de última medición no encontrada"""
        child_id = str(ObjectId())
        mock_collection.find_one.return_value = None
        
        result = get_latest_measurement_by_child(child_id)
        assert result is None
    
    def test_get_latest_measurement_by_child_invalid_id(self):
        """Test de última medición con ID inválido"""
        with pytest.raises(ValueError, match="ID de niño inválido"):
            get_latest_measurement_by_child("invalid_id")


# Configuración de pytest
@pytest.fixture(autouse=True)
def setup_logging():
    """Configurar logging para pruebas"""
    import logging
    logging.getLogger().setLevel(logging.DEBUG)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=backend.src.measurements", "--cov-report=html"])