import pytest
import pandas as pd
import numpy as np
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi.testclient import TestClient
from fastapi import HTTPException, FastAPI

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


class TestAIRoutes:
    """Tests para ai_routes.py"""
    
    def setup_method(self):
        """Setup para cada test"""
        # Crear una aplicación FastAPI para las pruebas
        app = FastAPI()
        app.include_router(ai_router)
        self.client = TestClient(app)
        
        self.child_id = str(ObjectId())
        self.valid_input = {
            "location_type": "urbano",
            "caregiver_education_level": "secundaria_completa",
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
            f"/ai/predecir-estado/{self.child_id}",
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
            "/ai/predecir-estado/invalid_id",
            json=self.valid_input
        )
        
        assert response.status_code == 400
        response_data = response.json()
        assert "ID de niño no válido" in response_data["detail"]

    def test_predecir_estado_invalid_child_id_empty(self):
        """Test endpoint con child_id vacío"""
        response = self.client.post(
            "/ai/predecir-estado/ ",  # ID con espacios
            json=self.valid_input
        )
        
        assert response.status_code == 400
        response_data = response.json()
        assert "ID de niño no válido" in response_data["detail"]

    def test_predecir_estado_invalid_child_id_wrong_format(self):
        """Test endpoint con child_id con formato incorrecto"""
        invalid_ids = [
            "123",  # Muy corto
            "invalid_objectid_format",  # Formato incorrecto
            "12345678901234567890123g",  # Contiene caracteres inválidos
            "",  # Vacío
        ]
        
        for invalid_id in invalid_ids:
            response = self.client.post(
                f"/ai/predecir-estado/{invalid_id}",
                json=self.valid_input
            )
            
            assert response.status_code == 400, f"Failed for invalid_id: {invalid_id}"
            response_data = response.json()
            assert "ID de niño no válido" in response_data["detail"]

    @patch('src.ai.ai_routes.preprocess_input')
    def test_predecir_estado_validation_error(self, mock_preprocess):
        """Test endpoint con error de validación"""
        mock_preprocess.side_effect = ValueError("Campo inválido")
        
        response = self.client.post(
            f"/ai/predecir-estado/{self.child_id}",
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
            f"/ai/predecir-estado/{self.child_id}",
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
        
        response = self.client.get(f"/ai/historial/{self.child_id}?limit=5")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["total_resultados"] == 1
        assert len(data["data"]["historial"]) == 1

    def test_obtener_historial_invalid_child_id(self):
        """Test historial con child_id inválido"""
        response = self.client.get("/ai/historial/invalid_id")
        
        assert response.status_code == 400
        assert "ID de niño no válido" in response.json()["detail"]

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_historial_internal_error(self, mock_historial):
        """Test historial con error interno"""
        mock_historial.side_effect = Exception("Error interno")
        
        response = self.client.get(f"/ai/historial/{self.child_id}")
        
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
        
        response = self.client.get(f"/ai/estadisticas/{self.child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["total_predicciones"] == 3
        assert data["data"]["estadisticas"]["resultado_mas_frecuente"] == "normal"
        # Redondear para evitar problemas de precisión flotante
        assert abs(data["data"]["estadisticas"]["confidence_promedio"] - 0.833) < 0.001

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_estadisticas_empty_history(self, mock_historial):
        """Test estadísticas con historial vacío"""
        mock_historial.return_value = []
        
        response = self.client.get(f"/ai/estadisticas/{self.child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["total_predicciones"] == 0
        assert data["message"] == "No hay predicciones para este niño"

    def test_obtener_estadisticas_invalid_child_id(self):
        """Test estadísticas con child_id inválido"""
        response = self.client.get("/ai/estadisticas/invalid_id")
        
        assert response.status_code == 400
        assert "ID de niño no válido" in response.json()["detail"]

    @patch('src.ai.ai_routes.obtener_historial_clasificaciones')
    def test_obtener_estadisticas_internal_error(self, mock_historial):
        """Test estadísticas con error interno"""
        mock_historial.side_effect = Exception("Error interno")
        
        response = self.client.get(f"/ai/estadisticas/{self.child_id}")
        
        assert response.status_code == 500
        assert "Error interno del servidor" in response.json()["detail"]

