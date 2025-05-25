import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import Mock, patch
from bson import ObjectId
from datetime import date, timedelta
import json
from unittest.mock import patch
from pydantic import ValidationError
from backend.src.measurements.measurement_models import MeasurementCreate
from fastapi import HTTPException

# Importar el router a testear
from backend.src.measurements.measurement_routes import measurement_router
from backend.src.measurements.measurement_models import Measurement

# Crear aplicación de prueba
app = FastAPI()
app.include_router(measurement_router)
client = TestClient(app)

class TestMeasurementRoutes:
    """Pruebas para los endpoints de mediciones"""
    
    def setup_method(self):
        """Configurar datos de prueba"""
        self.sample_measurement_id = str(ObjectId())
        self.sample_child_id = str(ObjectId())
        self.sample_measurement_data = {
            "child_id": self.sample_child_id,
            "peso": 25.0,
            "talla": 120.0,
            "fecha_medicion": str(date.today())
        }
        self.sample_measurement_response = {
            "_id": self.sample_measurement_id,
            "child_id": self.sample_child_id,
            "peso": 25.0,
            "talla": 120.0,
            "imc": 17.36,
            "fecha_medicion": str(date.today())
        }

    @patch('backend.src.measurements.measurement_routes.create_measurement')
    def test_create_measurement_success(self, mock_create):
        """Test de creación exitosa de medición"""
        mock_create.return_value = self.sample_measurement_id
        
        response = client.post("/measurements/", json=self.sample_measurement_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == "Medición registrada exitosamente"
        assert data["measurement_id"] == self.sample_measurement_id
        mock_create.assert_called_once()

    @patch('backend.src.measurements.measurement_routes.create_measurement')
    def test_create_measurement_validation_error(self, mock_create):
        """Test de error de validación al crear medición"""
        # Usar ValueError que es más simple y apropiado
        mock_create.side_effect = ValueError("El peso debe ser mayor a 0")
        
        response = client.post("/measurements/", json=self.sample_measurement_data)
        assert response.status_code == 400  # ValueError se mapea a 400
        assert response.json()["detail"] == "El peso debe ser mayor a 0"

    @patch('backend.src.measurements.measurement_routes.create_measurement')
    def test_create_measurement_value_error(self, mock_create):
        """Test de error de valor al crear medición"""
        mock_create.side_effect = ValueError("Datos inválidos")
        
        response = client.post("/measurements/", json=self.sample_measurement_data)
        
        assert response.status_code == 400
        assert response.json()["detail"] == "Datos inválidos"

    @patch('backend.src.measurements.measurement_routes.create_measurement')
    def test_create_measurement_internal_error(self, mock_create):
        """Test de error interno al crear medición"""
        mock_create.side_effect = Exception("Database error")
        
        response = client.post("/measurements/", json=self.sample_measurement_data)
        
        assert response.status_code == 500
        assert response.json()["detail"] == "Error interno del servidor"

    @patch('backend.src.measurements.measurement_routes.get_all_measurements')
    def test_read_all_measurements_success(self, mock_get_all):
        """Test de obtención exitosa de todas las mediciones"""
        mock_measurement = Measurement(**self.sample_measurement_response)
        mock_get_all.return_value = [mock_measurement]
        
        response = client.get("/measurements/")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["peso"] == 25.0

    @patch('backend.src.measurements.measurement_routes.get_all_measurements')
    def test_read_all_measurements_with_pagination(self, mock_get_all):
        """Test de paginación en obtención de mediciones"""
        mock_measurements = [
            Measurement(**{**self.sample_measurement_response, "_id": str(ObjectId())})
            for _ in range(5)
        ]
        mock_get_all.return_value = mock_measurements
        
        response = client.get("/measurements/?skip=2&limit=2")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2  # Paginación aplicada

    @patch('backend.src.measurements.measurement_routes.get_all_measurements')
    def test_read_all_measurements_error(self, mock_get_all):
        """Test de error al obtener todas las mediciones"""
        mock_get_all.side_effect = Exception("Database error")
        
        response = client.get("/measurements/")
        
        assert response.status_code == 500
        assert response.json()["detail"] == "Error interno del servidor"

    @patch('backend.src.measurements.measurement_routes.get_measurement_by_id')
    def test_read_one_measurement_success(self, mock_get_by_id):
        """Test de obtención exitosa de una medición"""
        mock_measurement = Measurement(**self.sample_measurement_response)
        mock_get_by_id.return_value = mock_measurement
        
        response = client.get(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["peso"] == 25.0

    @patch('backend.src.measurements.measurement_routes.get_measurement_by_id')
    def test_read_one_measurement_not_found(self, mock_get_by_id):
        """Test de medición no encontrada"""
        mock_get_by_id.return_value = None
        
        response = client.get(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Medición no encontrada"

    @patch('backend.src.measurements.measurement_routes.get_measurement_by_id')
    def test_read_one_measurement_invalid_id(self, mock_get_by_id):
        """Test de ID inválido al obtener medición"""
        mock_get_by_id.side_effect = ValueError("ID de medición inválido")
        
        response = client.get("/measurements/invalid_id")
        
        assert response.status_code == 400
        assert "ID de medición inválido" in response.json()["detail"]

    @patch('backend.src.measurements.measurement_routes.get_measurement_by_id')
    def test_read_one_measurement_internal_error(self, mock_get_by_id):
        """Test de error interno al obtener medición"""
        mock_get_by_id.side_effect = Exception("Database error")
        
        response = client.get(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 500

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_read_by_child_success(self, mock_get_by_child):
        """Test de obtención exitosa de mediciones por niño"""
        mock_measurement = Measurement(**self.sample_measurement_response)
        mock_get_by_child.return_value = [mock_measurement]
        
        response = client.get(f"/measurements/child/{self.sample_child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["child_id"] == self.sample_child_id

    @patch('backend.src.measurements.measurement_routes.get_latest_measurement_by_child')
    def test_read_by_child_latest_only(self, mock_get_latest):
        """Test de obtención de última medición de un niño"""
        mock_measurement = Measurement(**self.sample_measurement_response)
        mock_get_latest.return_value = mock_measurement
        
        response = client.get(f"/measurements/child/{self.sample_child_id}?latest_only=true")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        mock_get_latest.assert_called_once_with(self.sample_child_id)

    @patch('backend.src.measurements.measurement_routes.get_latest_measurement_by_child')
    def test_read_by_child_latest_only_not_found(self, mock_get_latest):
        """Test de última medición no encontrada"""
        mock_get_latest.return_value = None
        
        response = client.get(f"/measurements/child/{self.sample_child_id}?latest_only=true")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 0

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_read_by_child_invalid_id(self, mock_get_by_child):
        """Test de ID de niño inválido"""
        mock_get_by_child.side_effect = ValueError("ID de niño inválido")
        
        response = client.get("/measurements/child/invalid_id")
        
        assert response.status_code == 400

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_read_by_child_internal_error(self, mock_get_by_child):
        """Test de error interno al obtener mediciones por niño"""
        mock_get_by_child.side_effect = Exception("Database error")
        
        response = client.get(f"/measurements/child/{self.sample_child_id}")
        
        assert response.status_code == 500

    @patch('backend.src.measurements.measurement_routes.update_measurement')
    def test_update_measurement_success(self, mock_update):
        """Test de actualización exitosa de medición"""
        mock_update.return_value = True
        update_data = {"peso": 26.0}
        
        response = client.put(f"/measurements/{self.sample_measurement_id}", json=update_data)
        
        assert response.status_code == 200
        assert response.json()["message"] == "Medición actualizada exitosamente"
        mock_update.assert_called_once_with(self.sample_measurement_id, update_data)

    @patch('backend.src.measurements.measurement_routes.update_measurement')
    def test_update_measurement_not_found(self, mock_update):
        """Test de actualización de medición no encontrada"""
        mock_update.return_value = False
        update_data = {"peso": 26.0}
        
        response = client.put(f"/measurements/{self.sample_measurement_id}", json=update_data)
        
        assert response.status_code == 404
        assert "no encontrada" in response.json()["detail"]

    def test_update_measurement_invalid_fields(self):
        """Test de actualización con campos inválidos"""
        update_data = {"campo_invalido": "valor", "peso": 26.0}
        
        response = client.put(f"/measurements/{self.sample_measurement_id}", json=update_data)
        
        assert response.status_code == 400
        assert "Campos no permitidos" in response.json()["detail"]

    def test_update_measurement_empty_data(self):
        """Test de actualización sin datos"""
        response = client.put(f"/measurements/{self.sample_measurement_id}", json={})
        
        assert response.status_code == 400
        assert "No se proporcionaron datos" in response.json()["detail"]

    @patch('backend.src.measurements.measurement_routes.update_measurement')
    def test_update_measurement_value_error(self, mock_update):
        """Test de error de valor al actualizar"""
        mock_update.side_effect = ValueError("ID inválido")
        update_data = {"peso": 26.0}
        
        response = client.put(f"/measurements/{self.sample_measurement_id}", json=update_data)
        
        assert response.status_code == 400

    @patch('backend.src.measurements.measurement_routes.update_measurement')
    def test_update_measurement_internal_error(self, mock_update):
        """Test de error interno al actualizar"""
        mock_update.side_effect = Exception("Database error")
        update_data = {"peso": 26.0}
        
        response = client.put(f"/measurements/{self.sample_measurement_id}", json=update_data)
        
        assert response.status_code == 500

    @patch('backend.src.measurements.measurement_routes.delete_measurement')
    def test_delete_measurement_success(self, mock_delete):
        """Test de eliminación exitosa de medición"""
        mock_delete.return_value = True
        
        response = client.delete(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 200
        assert response.json()["message"] == "Medición eliminada exitosamente"
        mock_delete.assert_called_once_with(self.sample_measurement_id)

    @patch('backend.src.measurements.measurement_routes.delete_measurement')
    def test_delete_measurement_not_found(self, mock_delete):
        """Test de eliminación de medición no encontrada"""
        mock_delete.return_value = False
        
        response = client.delete(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 404
        assert "no encontrada" in response.json()["detail"]

    @patch('backend.src.measurements.measurement_routes.delete_measurement')
    def test_delete_measurement_value_error(self, mock_delete):
        """Test de error de valor al eliminar"""
        mock_delete.side_effect = ValueError("ID inválido")
        
        response = client.delete(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 400

    @patch('backend.src.measurements.measurement_routes.delete_measurement')
    def test_delete_measurement_internal_error(self, mock_delete):
        """Test de error interno al eliminar"""
        mock_delete.side_effect = Exception("Database error")
        
        response = client.delete(f"/measurements/{self.sample_measurement_id}")
        
        assert response.status_code == 500

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_get_child_stats_success(self, mock_get_by_child):
        """Test de obtención exitosa de estadísticas"""
        mock_measurements = [
            Measurement(**{
                "_id": str(ObjectId()),
                "child_id": self.sample_child_id,
                "peso": 24.0,
                "talla": 115.0,
                "imc": 18.15,
                "fecha_medicion": str(date.today() - timedelta(days=30))
            }),
            Measurement(**{
                "_id": str(ObjectId()),
                "child_id": self.sample_child_id,
                "peso": 25.0,
                "talla": 120.0,
                "imc": 17.36,
                "fecha_medicion": str(date.today())
            })
        ]
        mock_get_by_child.return_value = mock_measurements
        
        response = client.get(f"/measurements/child/{self.sample_child_id}/stats")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_mediciones"] == 2
        assert data["peso"]["actual"] == 25.0
        assert data["peso"]["minimo"] == 24.0
        assert data["peso"]["maximo"] == 25.0
        assert data["peso"]["promedio"] == 24.5
        assert data["talla"]["actual"] == 120.0
        assert data["imc"]["actual"] == 17.36

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_get_child_stats_no_measurements(self, mock_get_by_child):
        """Test de estadísticas sin mediciones"""
        mock_get_by_child.return_value = []
        
        response = client.get(f"/measurements/child/{self.sample_child_id}/stats")
        
        assert response.status_code == 404
        assert "No se encontraron mediciones" in response.json()["detail"]

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_get_child_stats_value_error(self, mock_get_by_child):
        """Test de error de valor en estadísticas"""
        mock_get_by_child.side_effect = ValueError("ID inválido")
        
        response = client.get("/measurements/child/invalid_id/stats")
        
        assert response.status_code == 400

    @patch('backend.src.measurements.measurement_routes.get_measurements_by_child')
    def test_get_child_stats_internal_error(self, mock_get_by_child):
        """Test de error interno en estadísticas"""
        mock_get_by_child.side_effect = Exception("Database error")
        
        response = client.get(f"/measurements/child/{self.sample_child_id}/stats")
        
        assert response.status_code == 500

    def test_calculate_stats_empty_measurements(self):
        """Test de función _calculate_stats con lista vacía"""
        from backend.src.measurements.measurement_routes import _calculate_stats
        
        stats = _calculate_stats([])
        
        assert stats["total_mediciones"] == 0
        assert stats["peso"]["actual"] is None
        assert stats["talla"]["actual"] is None
        assert stats["imc"]["actual"] is None
        assert stats["primera_medicion"] is None
        assert stats["ultima_medicion"] is None

    def test_calculate_stats_with_measurements(self):
        """Test de función _calculate_stats con mediciones"""
        from backend.src.measurements.measurement_routes import _calculate_stats
        
        measurements = [
            Measurement(**{
                "_id": str(ObjectId()),
                "child_id": self.sample_child_id,
                "peso": 24.0,
                "talla": 115.0,
                "imc": 18.15,
                "fecha_medicion": date.today() - timedelta(days=30)
            }),
            Measurement(**{
                "_id": str(ObjectId()),
                "child_id": self.sample_child_id,
                "peso": 25.0,
                "talla": 120.0,
                "imc": 17.36,
                "fecha_medicion": date.today()
            })
        ]
        
        stats = _calculate_stats(measurements)
        
        assert stats["total_mediciones"] == 2
        assert stats["peso"]["actual"] == 25.0
        assert stats["peso"]["promedio"] == 24.5
        assert stats["talla"]["minimo"] == 115.0
        assert stats["talla"]["maximo"] == 120.0

    def test_calculate_stats_with_none_imc(self):
        from backend.src.measurements.measurement_routes import _calculate_stats

        measurement_data = {
            "_id": str(ObjectId()),
            "child_id": self.sample_child_id,
            "peso": 25.0,
            "talla": 120.0,
            "imc": None,
            "fecha_medicion": date.today()
        }

        measurement = Measurement(**measurement_data)
        stats = _calculate_stats([measurement])

        assert stats["total_mediciones"] == 1
        assert stats["peso"]["actual"] == 25.0
        assert stats["imc"]["actual"] == round(25.0 / ((120.0 / 100) ** 2), 2)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])