import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from datetime import date, datetime
from backend.src.reports.report_routes import report_router
from backend.src.reports.report_models import (
    ReporteIndividual, ReporteGrupal, ReporteSeguimiento,
    MedicionReporte, ClasificacionReporte,
    EstadisticasNutricionales, EstadisticasSexo, ReportFilter
)

from unittest.mock import Mock, patch, MagicMock
from bson import ObjectId
from backend.src.reports.report_service import (
    calcular_edad, determinar_tendencia_imc, generar_reporte_individual,
    generar_reporte_grupal, generar_reporte_seguimiento,
    _build_match_filter, _get_estadisticas_sexo, _get_estadisticas_nutricionales,
    _get_promedios, _get_instituciones_representadas
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

    @patch('db.database.db')
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

    @patch('db.database.db')
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

    @patch('db.database.db')
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
            
class TestCalcularEdad:
    """Tests para la función calcular_edad"""
    
    def test_calcular_edad_cumpleanos_pasado(self):
        """Test cuando el cumpleaños ya pasó este año"""
        fecha_nacimiento = date(2015, 1, 1)
        with patch('backend.src.reports.report_service.date') as mock_date:
            mock_date.today.return_value = date(2024, 6, 1)
            mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
            edad = calcular_edad(fecha_nacimiento)
            assert edad == 9

    def test_calcular_edad_cumpleanos_no_pasado(self):
        """Test cuando el cumpleaños no ha pasado este año"""
        fecha_nacimiento = date(2015, 12, 1)
        with patch('backend.src.reports.report_service.date') as mock_date:
            mock_date.today.return_value = date(2024, 6, 1)
            mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
            edad = calcular_edad(fecha_nacimiento)
            assert edad == 8

    def test_calcular_edad_mismo_dia(self):
        """Test cuando es exactamente el cumpleaños"""
        fecha_nacimiento = date(2015, 6, 1)
        with patch('backend.src.reports.report_service.date') as mock_date:
            mock_date.today.return_value = date(2024, 6, 1)
            mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
            edad = calcular_edad(fecha_nacimiento)
            assert edad == 9


class TestDeterminarTendenciaImc:
    """Tests para la función determinar_tendencia_imc"""
    
    def test_tendencia_sin_mediciones(self):
        """Test con lista vacía"""
        result = determinar_tendencia_imc([])
        assert result is None

    def test_tendencia_una_medicion(self):
        """Test con una sola medición"""
        mediciones = [MedicionReporte(peso=20.0, talla=100.0, imc=20.0, fecha_medicion=date.today())]
        result = determinar_tendencia_imc(mediciones)
        assert result is None

    def test_tendencia_mejorando(self):
        """Test tendencia mejorando (IMC bajando)"""
        mediciones = [
            MedicionReporte(peso=25.0, talla=100.0, imc=25.0, fecha_medicion=date(2024, 1, 1)),
            MedicionReporte(peso=23.0, talla=100.0, imc=23.0, fecha_medicion=date(2024, 2, 1))
        ]
        result = determinar_tendencia_imc(mediciones)
        assert result == "mejorando"

    def test_tendencia_empeorando(self):
        """Test tendencia empeorando (IMC subiendo)"""
        mediciones = [
            MedicionReporte(peso=20.0, talla=100.0, imc=20.0, fecha_medicion=date(2024, 1, 1)),
            MedicionReporte(peso=23.0, talla=100.0, imc=23.0, fecha_medicion=date(2024, 2, 1))
        ]
        result = determinar_tendencia_imc(mediciones)
        assert result == "empeorando"

    def test_tendencia_estable(self):
        """Test tendencia estable"""
        mediciones = [
            MedicionReporte(peso=20.0, talla=100.0, imc=20.0, fecha_medicion=date(2024, 1, 1)),
            MedicionReporte(peso=20.2, talla=100.0, imc=20.2, fecha_medicion=date(2024, 2, 1))
        ]
        result = determinar_tendencia_imc(mediciones)
        assert result == "estable"

    def test_tendencia_tres_mediciones(self):
        """Test con tres mediciones (debe usar solo primera y última)"""
        mediciones = [
            MedicionReporte(peso=20.0, talla=100.0, imc=20.0, fecha_medicion=date(2024, 1, 1)),
            MedicionReporte(peso=25.0, talla=100.0, imc=25.0, fecha_medicion=date(2024, 2, 1)),
            MedicionReporte(peso=23.0, talla=100.0, imc=23.0, fecha_medicion=date(2024, 3, 1))
        ]
        result = determinar_tendencia_imc(mediciones)
        assert result == "empeorando"  # 23.0 - 20.0 = 3.0 > 0.5


class TestBuildMatchFilter:
    """Tests para la función _build_match_filter"""
    
    def test_filtro_vacio(self):
        """Test sin filtros"""
        result = _build_match_filter(None)
        assert result == {}

    def test_filtro_sexo(self):
        """Test filtro por sexo"""
        filtros = ReportFilter(sexo="M")
        result = _build_match_filter(filtros)
        assert result == {"sexo": "M"}

    def test_filtro_institucion(self):
        """Test filtro por institución"""
        filtros = ReportFilter(institucion="Escuela ABC")
        result = _build_match_filter(filtros)
        assert result == {"institucion": "Escuela ABC"}

    def test_filtro_barrio(self):
        """Test filtro por barrio"""
        filtros = ReportFilter(barrio="Centro")
        result = _build_match_filter(filtros)
        assert result == {"barrio": "Centro"}

    @patch('backend.src.reports.report_service.date')
    def test_filtro_edad_minima(self, mock_date):
        """Test filtro por edad mínima"""
        mock_date.today.return_value = date(2024, 6, 1)
        mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
        
        filtros = ReportFilter(rango_edad_min=5)
        result = _build_match_filter(filtros)
        expected_date = date(2019, 6, 1)  # 2024 - 5
        assert result == {"fecha_nacimiento": {"$lte": expected_date}}

    @patch('backend.src.reports.report_service.date')
    def test_filtro_edad_maxima(self, mock_date):
        """Test filtro por edad máxima"""
        mock_date.today.return_value = date(2024, 6, 1)
        mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
        
        filtros = ReportFilter(rango_edad_max=10)
        result = _build_match_filter(filtros)
        expected_date = date(2013, 6, 1)  # 2024 - 10 - 1
        assert result == {"fecha_nacimiento": {"$gte": expected_date}}

    @patch('backend.src.reports.report_service.date')
    def test_filtro_rango_edad_completo(self, mock_date):
        """Test filtro con rango de edad completo"""
        mock_date.today.return_value = date(2024, 6, 1)
        mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
        
        filtros = ReportFilter(rango_edad_min=5, rango_edad_max=10)
        result = _build_match_filter(filtros)
        expected = {
            "fecha_nacimiento": {
                "$gte": date(2013, 6, 1),  # edad máxima
                "$lte": date(2019, 6, 1)   # edad mínima
            }
        }
        assert result == expected


class TestGenerarReporteIndividual:
    """Tests para generar_reporte_individual"""
    
    @patch('backend.src.reports.report_service.children_col')
    @patch('backend.src.reports.report_service.measurements_col')
    @patch('backend.src.reports.report_service.classification_col')
    def test_reporte_individual_exitoso(self, mock_classification, mock_measurements, mock_children):
        """Test generación exitosa de reporte individual"""
        child_id = "507f1f77bcf86cd799439011"
        
        # Mock datos del niño
        mock_children.find_one.return_value = {
            "_id": ObjectId(child_id),
            "nombre": "Juan",
            "apellido": "Pérez",
            "fecha_nacimiento": date(2015, 1, 1),
            "sexo": "M",
            "institucion": "Escuela ABC",
            "barrio": "Centro"
        }
        
        # Mock mediciones
        mock_measurements.find.return_value.sort.return_value = [
            {
                "peso": 20.0,
                "talla": 100.0,
                "imc": 20.0,
                "fecha_medicion": date(2024, 1, 1)
            },
            {
                "peso": 21.0,
                "talla": 101.0,
                "imc": 20.6,
                "fecha_medicion": date(2024, 2, 1)
            }
        ]
        
        # Mock clasificaciones
        mock_classification.find.return_value.sort.return_value = [
            {
                "resultado": "normal",
                "modelo": "modelo_v1",
                "fecha_resultado": datetime(2024, 2, 1, 10, 0),
                "confidence_score": 0.95
            }
        ]
        
        with patch('backend.src.reports.report_service.calcular_edad', return_value=9):
            reporte = generar_reporte_individual(child_id)
        
        assert reporte.child_id == child_id
        assert reporte.nombre == "Juan"
        assert reporte.apellido == "Pérez"
        assert reporte.sexo == "M"
        assert reporte.edad_actual == 9
        assert reporte.institucion == "Escuela ABC"
        assert reporte.barrio == "Centro"
        assert len(reporte.mediciones) == 2
        assert len(reporte.clasificaciones) == 1
        assert reporte.ultima_clasificacion == "normal"
        assert reporte.tendencia_imc == "empeorando"  # 20.6 - 20.0 = 0.6 > 0.5

    @patch('backend.src.reports.report_service.children_col')
    def test_reporte_individual_nino_no_encontrado(self, mock_children):
        """Test cuando el niño no existe"""
        mock_children.find_one.return_value = None
        
        with pytest.raises(ValueError, match="no encontrado"):
            generar_reporte_individual("507f1f77bcf86cd799439011")

    @patch('backend.src.reports.report_service.children_col')
    def test_reporte_individual_sin_mediciones(self, mock_children):
        """Test reporte sin mediciones ni clasificaciones"""
        child_id = "507f1f77bcf86cd799439011"
        
        mock_children.find_one.return_value = {
            "_id": ObjectId(child_id),
            "nombre": "Ana",
            "apellido": "López",
            "fecha_nacimiento": date(2016, 6, 15),
            "sexo": "F"
        }
        
        with patch('backend.src.reports.report_service.measurements_col') as mock_measurements, \
             patch('backend.src.reports.report_service.classification_col') as mock_classification, \
             patch('backend.src.reports.report_service.calcular_edad', return_value=8):
            
            mock_measurements.find.return_value.sort.return_value = []
            mock_classification.find.return_value.sort.return_value = []
            
            reporte = generar_reporte_individual(child_id)
            
            assert reporte.nombre == "Ana"
            assert len(reporte.mediciones) == 0
            assert len(reporte.clasificaciones) == 0
            assert reporte.ultima_clasificacion is None
            assert reporte.tendencia_imc is None


class TestGetEstadisticasSexo:
    """Tests para _get_estadisticas_sexo"""
    
    @patch('backend.src.reports.report_service.children_col')
    def test_estadisticas_sexo(self, mock_children):
        """Test estadísticas por sexo"""
        mock_children.aggregate.return_value = [
            {"_id": "M", "count": 15},
            {"_id": "F", "count": 12}
        ]
        
        result = _get_estadisticas_sexo({}, 27)
        
        assert result.masculino == 15
        assert result.femenino == 12
        assert result.total == 27

    @patch('backend.src.reports.report_service.children_col')
    def test_estadisticas_sexo_vacio(self, mock_children):
        """Test estadísticas por sexo sin datos"""
        mock_children.aggregate.return_value = []
        
        result = _get_estadisticas_sexo({}, 0)
        
        assert result.masculino == 0
        assert result.femenino == 0
        assert result.total == 0


class TestGetEstadisticasNutricionales:
    """Tests para _get_estadisticas_nutricionales"""
    
    @patch('backend.src.reports.report_service.children_col')
    def test_estadisticas_nutricionales_completas(self, mock_children):
        """Test estadísticas nutricionales completas"""
        mock_children.aggregate.return_value = [
            {"_id": "normal", "count": 20},
            {"_id": "riesgo_desnutricion", "count": 5},
            {"_id": "desnutricion_aguda_moderada", "count": 3},
            {"_id": "desnutricion_aguda_severa", "count": 1},
            {"_id": "sobrepeso", "count": 4},
            {"_id": "obesidad", "count": 2}
        ]
        
        result = _get_estadisticas_nutricionales({})
        
        assert result.normal == 20
        assert result.riesgo_desnutricion == 5
        assert result.desnutricion_aguda_moderada == 3
        assert result.desnutricion_aguda_severa == 1
        assert result.sobrepeso == 4
        assert result.obesidad == 2
        assert result.total == 35

    @patch('backend.src.reports.report_service.children_col')
    def test_estadisticas_nutricionales_vacias(self, mock_children):
        """Test estadísticas nutricionales sin datos"""
        mock_children.aggregate.return_value = []
        
        result = _get_estadisticas_nutricionales({})
        
        assert result.normal == 0
        assert result.total == 0


class TestGetPromedios:
    """Tests para _get_promedios"""
    
    @patch('backend.src.reports.report_service.children_col')
    def test_promedios_con_datos(self, mock_children):
        """Test cálculo de promedios con datos"""
        mock_children.aggregate.return_value = [
            {
                "_id": None,
                "promedio_imc": 18.5,
                "promedio_edad": 7.3
            }
        ]
        
        imc, edad = _get_promedios({})
        
        assert imc == 18.5
        assert edad == 7.3

    @patch('backend.src.reports.report_service.children_col')
    def test_promedios_sin_datos(self, mock_children):
        """Test cálculo de promedios sin datos"""
        mock_children.aggregate.return_value = []
        
        imc, edad = _get_promedios({})
        
        assert imc is None
        assert edad is None

    @patch('backend.src.reports.report_service.children_col')
    def test_promedios_con_nulos(self, mock_children):
        """Test cálculo de promedios con valores nulos"""
        mock_children.aggregate.return_value = [
            {
                "_id": None,
                "promedio_imc": None,
                "promedio_edad": None
            }
        ]
        
        imc, edad = _get_promedios({})
        
        assert imc is None
        assert edad is None


class TestGetInstitucionesRepresentadas:
    """Tests para _get_instituciones_representadas"""
    
    @patch('backend.src.reports.report_service.children_col')
    def test_instituciones_representadas(self, mock_children):
        """Test obtener instituciones representadas"""
        mock_children.distinct.return_value = ["Escuela A", "Escuela B", None, "Jardín C"]
        
        result = _get_instituciones_representadas({})
        
        assert result == ["Escuela A", "Escuela B", "Jardín C"]
        mock_children.distinct.assert_called_once_with("institucion", {})


class TestGenerarReporteGrupal:
    """Tests para generar_reporte_grupal"""
    
    @patch('backend.src.reports.report_service._get_instituciones_representadas')
    @patch('backend.src.reports.report_service._get_promedios')
    @patch('backend.src.reports.report_service._get_estadisticas_nutricionales')
    @patch('backend.src.reports.report_service._get_estadisticas_sexo')
    @patch('backend.src.reports.report_service.children_col')
    def test_reporte_grupal_exitoso(self, mock_children, mock_sexo, mock_nutricional, 
                                   mock_promedios, mock_instituciones):
        """Test generación exitosa de reporte grupal"""
        # Setup mocks
        mock_children.count_documents.return_value = 50
        mock_sexo.return_value = EstadisticasSexo(masculino=25, femenino=25, total=50)
        mock_nutricional.return_value = EstadisticasNutricionales(normal=40, sobrepeso=10, total=50)
        mock_promedios.return_value = (18.5, 7.2)
        mock_instituciones.return_value = ["Escuela A", "Escuela B"]
        
        reporte = generar_reporte_grupal()
        
        assert reporte.total_ninos == 50
        assert reporte.estadisticas_sexo.masculino == 25
        assert reporte.estadisticas_nutricionales.normal == 40
        assert reporte.promedio_imc_general == 18.5
        assert reporte.promedio_edad == 7.2
        assert len(reporte.instituciones_representadas) == 2

    @patch('backend.src.reports.report_service._build_match_filter')
    @patch('backend.src.reports.report_service.children_col')
    def test_reporte_grupal_con_filtros(self, mock_children, mock_filter):
        """Test reporte grupal con filtros"""
        filtros = ReportFilter(sexo="M", institucion="Escuela A")
        mock_filter.return_value = {"sexo": "M", "institucion": "Escuela A"}
        mock_children.count_documents.return_value = 15
        
        with patch('backend.src.reports.report_service._get_estadisticas_sexo') as mock_sexo, \
             patch('backend.src.reports.report_service._get_estadisticas_nutricionales') as mock_nutricional, \
             patch('backend.src.reports.report_service._get_promedios') as mock_promedios, \
             patch('backend.src.reports.report_service._get_instituciones_representadas') as mock_instituciones:
            
            mock_sexo.return_value = EstadisticasSexo(masculino=15, total=15)
            mock_nutricional.return_value = EstadisticasNutricionales(normal=12, total=15)
            mock_promedios.return_value = (17.8, 8.1)
            mock_instituciones.return_value = ["Escuela A"]
            
            reporte = generar_reporte_grupal(filtros)
            
            assert reporte.total_ninos == 15
            mock_filter.assert_called_once_with(filtros)


class TestGenerarReporteSeguimiento:
    """Tests para generar_reporte_seguimiento"""
    
    @patch('backend.src.reports.report_service.children_col')
    @patch('backend.src.reports.report_service.measurements_col')
    def test_reporte_seguimiento_exitoso(self, mock_measurements, mock_children):
        """Test generación exitosa de reporte de seguimiento"""
        child_id = "507f1f77bcf86cd799439011"
        
        mock_children.find_one.return_value = {
            "_id": ObjectId(child_id),
            "nombre": "Carlos",
            "apellido": "Ruiz"
        }
        
        mock_measurements.find.return_value.sort.return_value = [
            {
                "peso": 18.0,
                "talla": 95.0,
                "imc": 19.9,
                "fecha_medicion": date(2024, 1, 1)
            },
            {
                "peso": 20.0,
                "talla": 100.0,
                "imc": 20.0,
                "fecha_medicion": date(2024, 3, 1)
            }
        ]
        
        reporte = generar_reporte_seguimiento(child_id)
        
        assert reporte.child_id == child_id
        assert reporte.nombre == "Carlos"
        assert reporte.apellido == "Ruiz"
        assert reporte.total_mediciones == 2
        assert reporte.primera_medicion == date(2024, 1, 1)
        assert reporte.ultima_medicion == date(2024, 3, 1)
        assert reporte.cambio_peso == 2.0
        assert reporte.cambio_talla == 5.0
        assert reporte.cambio_imc == 0.1
        assert reporte.meses_seguimiento == pytest.approx(2.0, abs=0.1)

    @patch('backend.src.reports.report_service.children_col')
    def test_reporte_seguimiento_nino_no_encontrado(self, mock_children):
        """Test reporte de seguimiento cuando el niño no existe"""
        mock_children.find_one.return_value = None
        
        with pytest.raises(ValueError, match="no encontrado"):
            generar_reporte_seguimiento("507f1f77bcf86cd799439011")

    @patch('backend.src.reports.report_service.children_col')
    @patch('backend.src.reports.report_service.measurements_col')
    def test_reporte_seguimiento_sin_mediciones(self, mock_measurements, mock_children):
        """Test reporte de seguimiento sin mediciones"""
        child_id = "507f1f77bcf86cd799439011"
        
        mock_children.find_one.return_value = {
            "_id": ObjectId(child_id),
            "nombre": "María",
            "apellido": "García"
        }
        
        mock_measurements.find.return_value.sort.return_value = []
        
        reporte = generar_reporte_seguimiento(child_id)
        
        assert reporte.total_mediciones == 0
        assert reporte.primera_medicion is None
        assert reporte.cambio_peso is None

    @patch('backend.src.reports.report_service.children_col')
    @patch('backend.src.reports.report_service.measurements_col')  
    def test_reporte_seguimiento_una_medicion(self, mock_measurements, mock_children):
        """Test reporte de seguimiento con una sola medición"""
        child_id = "507f1f77bcf86cd799439011"
        
        mock_children.find_one.return_value = {
            "_id": ObjectId(child_id),
            "nombre": "Pedro",
            "apellido": "Martínez"
        }
        
        mock_measurements.find.return_value.sort.return_value = [
            {
                "peso": 18.0,
                "talla": 95.0,
                "imc": 19.9,
                "fecha_medicion": date(2024, 1, 1)
            }
        ]
        
        reporte = generar_reporte_seguimiento(child_id)
        
        assert reporte.total_mediciones == 1
        assert reporte.primera_medicion == date(2024, 1, 1)
        assert reporte.ultima_medicion == date(2024, 1, 1)
        assert reporte.cambio_peso is None  # No hay cambio con una sola medición


class TestReportFilter:
    """Tests para el modelo ReportFilter"""
    
    def test_report_filter_valido(self):
        """Test creación válida de ReportFilter"""
        filtro = ReportFilter(
            sexo="M",
            rango_edad_min=5,
            rango_edad_max=12,
            institucion="Escuela ABC",
            barrio="Centro"
        )
        assert filtro.sexo == "M"
        assert filtro.rango_edad_min == 5
        assert filtro.rango_edad_max == 12

    def test_report_filter_sexo_invalido(self):
        """Test validación de sexo inválido"""
        with pytest.raises(ValueError, match="El sexo debe ser M o F"):
            ReportFilter(sexo="X")

    def test_report_filter_edad_invalida(self):
        """Test validación de edad inválida"""
        with pytest.raises(ValueError, match="La edad debe estar entre 0 y 18 años"):
            ReportFilter(rango_edad_min=-1)
        
        with pytest.raises(ValueError, match="La edad debe estar entre 0 y 18 años"):
            ReportFilter(rango_edad_max=25)


# Fixtures para reutilizar en pruebas
@pytest.fixture
def sample_child_data():
    """Fixture con datos de ejemplo de un niño"""
    return {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "nombre": "Test",
        "apellido": "Child",
        "fecha_nacimiento": date(2015, 6, 15),
        "sexo": "M",
        "institucion": "Test School",
        "barrio": "Test Neighborhood"
    }


@pytest.fixture
def sample_measurements():
    """Fixture con mediciones de ejemplo"""
    return [
        {
            "peso": 18.0,
            "talla": 95.0,
            "imc": 19.9,
            "fecha_medicion": date(2024, 1, 1)
        },
        {
            "peso": 19.0,
            "talla": 98.0,
            "imc": 19.8,
            "fecha_medicion": date(2024, 2, 1)
        }
    ]


@pytest.fixture
def sample_classifications():
    """Fixture con clasificaciones de ejemplo"""
    return [
        {
            "resultado": "normal",
            "modelo": "modelo_v1",
            "fecha_resultado": datetime(2024, 2, 1, 10, 0),
            "confidence_score": 0.95
        }
    ]