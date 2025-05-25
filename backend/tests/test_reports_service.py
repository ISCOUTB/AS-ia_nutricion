import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import patch, Mock
from datetime import date, datetime
from backend.src.reports.report_routes import report_router
from backend.src.reports.report_models import (
    ReporteIndividual, ReporteGrupal, ReporteSeguimiento,
    MedicionReporte, ClasificacionReporte,
    EstadisticasNutricionales, EstadisticasSexo
)

# Crear una aplicación FastAPI de prueba
app = FastAPI()
app.include_router(report_router)
client = TestClient(app)


class TestReportRoutes:
    """Tests para los endpoints de reportes"""

    @patch('backend.src.reports.report_routes.generar_reporte_individual')
    def test_obtener_reporte_individual_exitoso(self, mock_generar):
        """Test endpoint reporte individual exitoso"""
        child_id = "507f1f77bcf86cd799439011"
        
        # Mock del reporte individual
        mock_reporte = ReporteIndividual(
            child_id=child_id,
            nombre="Juan",
            apellido="Pérez",
            fecha_nacimiento=date(2015, 1, 1),
            sexo="M",
            edad_actual=9,
            institucion="Escuela ABC",
            barrio="Centro",
            mediciones=[
                MedicionReporte(
                    peso=20.0,
                    talla=100.0,
                    imc=20.0,
                    fecha_medicion=date(2024, 1, 1)
                )
            ],
            clasificaciones=[
                ClasificacionReporte(
                    resultado="normal",
                    modelo="modelo_v1",
                    fecha_resultado=datetime(2024, 1, 1, 10, 0),
                    confidence_score=0.95
                )
            ],
            ultima_clasificacion="normal",
            tendencia_imc="estable"
        )
        
        mock_generar.return_value = mock_reporte
        
        response = client.get(f"/reports/individual/{child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["child_id"] == child_id
        assert data["nombre"] == "Juan"
        assert data["apellido"] == "Pérez"
        assert data["sexo"] == "M"
        assert data["edad_actual"] == 9
        assert data["ultima_clasificacion"] == "normal"
        assert len(data["mediciones"]) == 1
        assert len(data["clasificaciones"]) == 1
        
        mock_generar.assert_called_once_with(child_id)

    @patch('backend.src.reports.report_routes.generar_reporte_individual')
    def test_obtener_reporte_individual_no_encontrado(self, mock_generar):
        """Test endpoint reporte individual - niño no encontrado"""
        child_id = "507f1f77bcf86cd799439011"
        mock_generar.side_effect = ValueError(f"Niño con ID {child_id} no encontrado")
        
        response = client.get(f"/reports/individual/{child_id}")
        
        assert response.status_code == 404
        data = response.json()
        assert "no encontrado" in data["detail"]

    @patch('backend.src.reports.report_routes.generar_reporte_individual')
    def test_obtener_reporte_individual_error_interno(self, mock_generar):
        """Test endpoint reporte individual - error interno"""
        child_id = "507f1f77bcf86cd799439011"
        mock_generar.side_effect = Exception("Error de base de datos")
        
        response = client.get(f"/reports/individual/{child_id}")
        
        assert response.status_code == 500
        data = response.json()
        assert "Error interno del servidor" in data["detail"]

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_obtener_reporte_grupal_sin_filtros(self, mock_generar):
        """Test endpoint reporte grupal sin filtros"""
        mock_reporte = ReporteGrupal(
            total_ninos=50,
            estadisticas_nutricionales=EstadisticasNutricionales(
                normal=40,
                sobrepeso=8,
                obesidad=2,
                total=50
            ),
            estadisticas_sexo=EstadisticasSexo(
                masculino=25,
                femenino=25,
                total=50
            ),
            promedio_imc_general=18.5,
            promedio_edad=7.3,
            instituciones_representadas=["Escuela A", "Escuela B"],
            fecha_generacion=datetime(2024, 1, 1, 12, 0)
        )
        
        mock_generar.return_value = mock_reporte
        
        response = client.get("/reports/group")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_ninos"] == 50
        assert data["estadisticas_nutricionales"]["normal"] == 40
        assert data["estadisticas_sexo"]["masculino"] == 25
        assert data["promedio_imc_general"] == 18.5
        assert len(data["instituciones_representadas"]) == 2
        
        # Verificar que se llamó sin filtros
        mock_generar.assert_called_once_with(None)

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_obtener_reporte_grupal_con_filtros(self, mock_generar):
        """Test endpoint reporte grupal con filtros"""
        mock_reporte = ReporteGrupal(
            total_ninos=15,
            estadisticas_nutricionales=EstadisticasNutricionales(normal=12, total=15),
            estadisticas_sexo=EstadisticasSexo(masculino=15, total=15),
            promedio_imc_general=17.8,
            promedio_edad=8.1,
            instituciones_representadas=["Escuela A"]
        )
        
        mock_generar.return_value = mock_reporte
        
        response = client.get("/reports/group?sexo=M&edad_min=5&edad_max=10&institucion=Escuela%20A&barrio=Centro")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_ninos"] == 15
        
        # Verificar que se llamó con filtros
        mock_generar.assert_called_once()
        call_args = mock_generar.call_args[0]
        filtros = call_args[0]
        assert filtros is not None
        assert filtros.sexo == "M"
        assert filtros.rango_edad_min == 5
        assert filtros.rango_edad_max == 10
        assert filtros.institucion == "Escuela A"
        assert filtros.barrio == "Centro"

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_obtener_reporte_grupal_filtros_parciales(self, mock_generar):
        """Test endpoint reporte grupal con algunos filtros"""
        mock_reporte = ReporteGrupal(
            total_ninos=20,
            estadisticas_nutricionales=EstadisticasNutricionales(normal=18, total=20),
            estadisticas_sexo=EstadisticasSexo(femenino=20, total=20),
            promedio_imc_general=18.2,
            promedio_edad=6.5,
            instituciones_representadas=["Escuela B"]
        )
        
        mock_generar.return_value = mock_reporte
        
        response = client.get("/reports/group?sexo=F&institucion=Escuela%20B")
        
        assert response.status_code == 200
        
        # Verificar que se crearon filtros solo para los parámetros proporcionados
        mock_generar.assert_called_once()
        call_args = mock_generar.call_args[0]
        filtros = call_args[0]
        assert filtros is not None
        assert filtros.sexo == "F"
        assert filtros.institucion == "Escuela B"
        assert filtros.rango_edad_min is None
        assert filtros.rango_edad_max is None
        assert filtros.barrio is None

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_obtener_reporte_grupal_error_validacion(self, mock_generar):
        """Test endpoint reporte grupal - error de validación"""
        mock_generar.side_effect = ValueError("El sexo debe ser M o F")
        
        response = client.get("/reports/group?sexo=X")
        
        assert response.status_code == 400
        data = response.json()
        assert "El sexo debe ser M o F" in data["detail"]

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_obtener_reporte_grupal_error_interno(self, mock_generar):
        """Test endpoint reporte grupal - error interno"""
        mock_generar.side_effect = Exception("Error de base de datos")
        
        response = client.get("/reports/group")
        
        assert response.status_code == 500
        data = response.json()
        assert "Error interno del servidor" in data["detail"]

    @patch('backend.src.reports.report_routes.generar_reporte_seguimiento')
    def test_obtener_reporte_seguimiento_exitoso(self, mock_generar):
        """Test endpoint reporte de seguimiento exitoso"""
        child_id = "507f1f77bcf86cd799439011"
        
        mock_reporte = ReporteSeguimiento(
            child_id=child_id,
            nombre="Ana",
            apellido="López",
            total_mediciones=5,
            primera_medicion=date(2024, 1, 1),
            ultima_medicion=date(2024, 5, 1),
            cambio_peso=2.5,
            cambio_talla=8.0,
            cambio_imc=0.3,
            meses_seguimiento=4.0
        )
        
        mock_generar.return_value = mock_reporte
        
        response = client.get(f"/reports/seguimiento/{child_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["child_id"] == child_id
        assert data["nombre"] == "Ana"
        assert data["apellido"] == "López"
        assert data["total_mediciones"] == 5
        assert data["cambio_peso"] == 2.5
        assert data["cambio_talla"] == 8.0
        assert data["meses_seguimiento"] == 4.0
        
        mock_generar.assert_called_once_with(child_id)

    @patch('backend.src.reports.report_routes.generar_reporte_seguimiento')
    def test_obtener_reporte_seguimiento_no_encontrado(self, mock_generar):
        """Test endpoint reporte de seguimiento - niño no encontrado"""
        child_id = "507f1f77bcf86cd799439011"
        mock_generar.side_effect = ValueError(f"Niño con ID {child_id} no encontrado")
        
        response = client.get(f"/reports/seguimiento/{child_id}")
        
        assert response.status_code == 404
        data = response.json()
        assert "no encontrado" in data["detail"]

    @patch('backend.src.reports.report_routes.generar_reporte_seguimiento')
    def test_obtener_reporte_seguimiento_error_interno(self, mock_generar):
        """Test endpoint reporte de seguimiento - error interno"""
        child_id = "507f1f77bcf86cd799439011"
        mock_generar.side_effect = Exception("Error de base de datos")
        
        response = client.get(f"/reports/seguimiento/{child_id}")
        
        assert response.status_code == 500
        data = response.json()
        assert "Error interno del servidor" in data["detail"]

    def test_health_check(self):
        """Test endpoint de health check"""
        response = client.get("/reports/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "reports"

    @patch('backend.src.reports.report_routes.db')
    def test_obtener_estadisticas_rapidas_exitoso(self, mock_db):
        """Test endpoint estadísticas rápidas exitoso"""
        # Mock de las colecciones
        mock_db.children.count_documents.return_value = 100
        mock_db.anthropometric_data.count_documents.return_value = 250
        mock_db.classification_results.count_documents.return_value = 180
        
        # Mock de últimas actividades
        mock_db.anthropometric_data.find_one.return_value = {
            "fecha_medicion": date(2024, 5, 15)
        }
        mock_db.classification_results.find_one.return_value = {
            "fecha_resultado": datetime(2024, 5, 16, 14, 30)
        }
        
        response = client.get("/reports/stats/quick")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_ninos"] == 100
        assert data["total_mediciones"] == 250
        assert data["total_clasificaciones"] == 180
        assert data["ultima_medicion"] == "2024-05-15"
        assert data["ultima_clasificacion"] == "2024-05-16T14:30:00"

    @patch('backend.src.reports.report_routes.db')
    def test_obtener_estadisticas_rapidas_sin_datos(self, mock_db):
        """Test endpoint estadísticas rápidas sin datos"""
        # Mock sin datos
        mock_db.children.count_documents.return_value = 0
        mock_db.anthropometric_data.count_documents.return_value = 0
        mock_db.classification_results.count_documents.return_value = 0
        mock_db.anthropometric_data.find_one.return_value = None
        mock_db.classification_results.find_one.return_value = None
        
        response = client.get("/reports/stats/quick")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_ninos"] == 0
        assert data["total_mediciones"] == 0
        assert data["total_clasificaciones"] == 0
        assert data["ultima_medicion"] is None
        assert data["ultima_clasificacion"] is None

    @patch('backend.src.reports.report_routes.db')
    def test_obtener_estadisticas_rapidas_error(self, mock_db):
        """Test endpoint estadísticas rápidas - error"""
        mock_db.children.count_documents.side_effect = Exception("Error de conexión")
        
        response = client.get("/reports/stats/quick")
        
        assert response.status_code == 500
        data = response.json()
        assert "Error obteniendo estadísticas" in data["detail"]

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_obtener_reporte_grupal_sin_filtros_ninguno(self, mock_generar):
        """Test endpoint reporte grupal cuando no se pasa ningún filtro"""
        mock_reporte = ReporteGrupal(
            total_ninos=30,
            estadisticas_nutricionales=EstadisticasNutricionales(normal=25, total=30),
            estadisticas_sexo=EstadisticasSexo(masculino=15, femenino=15, total=30),
            promedio_imc_general=18.0,
            promedio_edad=7.0,
            instituciones_representadas=["Escuela C"]
        )
        
        mock_generar.return_value = mock_reporte
        
        # Sin parámetros de query
        response = client.get("/reports/group")
        
        assert response.status_code == 200
        
        # Debe llamarse con None (sin filtros)
        mock_generar.assert_called_once_with(None)

    def test_endpoints_paths(self):
        """Test que verifica que todos los endpoints existen"""
        # Verificar que los endpoints están correctamente registrados
        routes = [route.path for route in app.routes]
        
        expected_paths = [
            "/reports/individual/{child_id}",
            "/reports/group",
            "/reports/seguimiento/{child_id}",
            "/reports/health",
            "/reports/stats/quick"
        ]
        
        for path in expected_paths:
            # Verificar que el path existe en alguna forma
            path_exists = any(expected_path in route_path for route_path in routes for expected_path in [path])
            assert path_exists or path in routes, f"Ruta {path} no encontrada"


class TestReportFilterValidation:
    """Tests adicionales para validación de filtros en endpoints"""
    
    def test_parametros_query_tipos_correctos(self):
        """Test que los parámetros de query se procesan con tipos correctos"""
        with patch('backend.src.reports.report_routes.generar_reporte_grupal') as mock_generar:
            mock_reporte = ReporteGrupal(
                total_ninos=10,
                estadisticas_nutricionales=EstadisticasNutricionales(total=10),
                estadisticas_sexo=EstadisticasSexo(total=10),
                instituciones_representadas=[]
            )
            mock_generar.return_value = mock_reporte
            
            response = client.get("/reports/group?edad_min=5&edad_max=15")
            
            assert response.status_code == 200
            
            # Verificar que los parámetros se pasaron como enteros
            mock_generar.assert_called_once()
            call_args = mock_generar.call_args[0]
            filtros = call_args[0]
            assert isinstance(filtros.rango_edad_min, int)
            assert isinstance(filtros.rango_edad_max, int)
            assert filtros.rango_edad_min == 5
            assert filtros.rango_edad_max == 15


# Tests de integración básica
class TestReportRoutesIntegration:
    """Tests de integración básica para verificar la estructura de respuestas"""
    
    @patch('backend.src.reports.report_routes.generar_reporte_individual')
    def test_estructura_respuesta_individual(self, mock_generar):
        """Test estructura completa de respuesta individual"""
        mock_reporte = ReporteIndividual(
            child_id="test_id",
            nombre="Test",
            apellido="Child",
            fecha_nacimiento=date(2015, 1, 1),
            sexo="M",
            edad_actual=9,
            mediciones=[],
            clasificaciones=[]
        )
        mock_generar.return_value = mock_reporte
        
        response = client.get("/reports/individual/test_id")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verificar campos obligatorios
        required_fields = [
            "child_id", "nombre", "apellido", "fecha_nacimiento",
            "sexo", "edad_actual", "mediciones", "clasificaciones"
        ]
        for field in required_fields:
            assert field in data, f"Campo {field} faltante en respuesta"

    @patch('backend.src.reports.report_routes.generar_reporte_grupal')
    def test_estructura_respuesta_grupal(self, mock_generar):
        """Test estructura completa de respuesta grupal"""
        mock_reporte = ReporteGrupal(
            total_ninos=0,
            estadisticas_nutricionales=EstadisticasNutricionales(),
            estadisticas_sexo=EstadisticasSexo(),
            instituciones_representadas=[]
        )
        mock_generar.return_value = mock_reporte
        
        response = client.get("/reports/group")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verificar campos obligatorios
        required_fields = [
            "total_ninos", "estadisticas_nutricionales", "estadisticas_sexo",
            "instituciones_representadas", "fecha_generacion"
        ]
        for field in required_fields:
            assert field in data, f"Campo {field} faltante en respuesta"

    @patch('backend.src.reports.report_routes.generar_reporte_seguimiento')
    def test_estructura_respuesta_seguimiento(self, mock_generar):
        """Test estructura completa de respuesta seguimiento"""
        mock_reporte = ReporteSeguimiento(
            child_id="test_id",
            nombre="Test",
            apellido="Child",
            total_mediciones=0
        )
        mock_generar.return_value = mock_reporte
        
        response = client.get("/reports/seguimiento/test_id")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verificar campos obligatorios
        required_fields = [
            "child_id", "nombre", "apellido", "total_mediciones"
        ]
        for field in required_fields:
            assert field in data, f"Campo {field} faltante en respuesta"