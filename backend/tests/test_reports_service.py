import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import date, datetime
from bson import ObjectId
from backend.src.reports.report_service import (
    calcular_edad, determinar_tendencia_imc, generar_reporte_individual,
    generar_reporte_grupal, generar_reporte_seguimiento,
    _build_match_filter, _get_estadisticas_sexo, _get_estadisticas_nutricionales,
    _get_promedios, _get_instituciones_representadas
)
from backend.src.reports.report_models import (
    ReportFilter, MedicionReporte, ClasificacionReporte,
    EstadisticasNutricionales, EstadisticasSexo
)


class TestCalcularEdad:
    """Tests para la función calcular_edad"""
    
    def test_calcular_edad_cumpleanos_pasado(self):
        """Test cuando el cumpleaños ya pasó este año"""
        fecha_nacimiento = date(2015, 1, 1)
        with patch('reports.report_service.date') as mock_date:
            mock_date.today.return_value = date(2024, 6, 1)
            mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
            edad = calcular_edad(fecha_nacimiento)
            assert edad == 9

    def test_calcular_edad_cumpleanos_no_pasado(self):
        """Test cuando el cumpleaños no ha pasado este año"""
        fecha_nacimiento = date(2015, 12, 1)
        with patch('reports.report_service.date') as mock_date:
            mock_date.today.return_value = date(2024, 6, 1)
            mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
            edad = calcular_edad(fecha_nacimiento)
            assert edad == 8

    def test_calcular_edad_mismo_dia(self):
        """Test cuando es exactamente el cumpleaños"""
        fecha_nacimiento = date(2015, 6, 1)
        with patch('reports.report_service.date') as mock_date:
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

    @patch('reports.report_service.date')
    def test_filtro_edad_minima(self, mock_date):
        """Test filtro por edad mínima"""
        mock_date.today.return_value = date(2024, 6, 1)
        mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
        
        filtros = ReportFilter(rango_edad_min=5)
        result = _build_match_filter(filtros)
        expected_date = date(2019, 6, 1)  # 2024 - 5
        assert result == {"fecha_nacimiento": {"$lte": expected_date}}

    @patch('reports.report_service.date')
    def test_filtro_edad_maxima(self, mock_date):
        """Test filtro por edad máxima"""
        mock_date.today.return_value = date(2024, 6, 1)
        mock_date.side_effect = lambda *args, **kw: date(*args, **kw)
        
        filtros = ReportFilter(rango_edad_max=10)
        result = _build_match_filter(filtros)
        expected_date = date(2013, 6, 1)  # 2024 - 10 - 1
        assert result == {"fecha_nacimiento": {"$gte": expected_date}}

    @patch('reports.report_service.date')
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
    
    @patch('reports.report_service.children_col')
    @patch('reports.report_service.measurements_col')
    @patch('reports.report_service.classification_col')
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
        
        with patch('reports.report_service.calcular_edad', return_value=9):
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

    @patch('reports.report_service.children_col')
    def test_reporte_individual_nino_no_encontrado(self, mock_children):
        """Test cuando el niño no existe"""
        mock_children.find_one.return_value = None
        
        with pytest.raises(ValueError, match="no encontrado"):
            generar_reporte_individual("507f1f77bcf86cd799439011")

    @patch('reports.report_service.children_col')
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
        
        with patch('reports.report_service.measurements_col') as mock_measurements, \
             patch('reports.report_service.classification_col') as mock_classification, \
             patch('reports.report_service.calcular_edad', return_value=8):
            
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
    
    @patch('reports.report_service.children_col')
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

    @patch('reports.report_service.children_col')
    def test_estadisticas_sexo_vacio(self, mock_children):
        """Test estadísticas por sexo sin datos"""
        mock_children.aggregate.return_value = []
        
        result = _get_estadisticas_sexo({}, 0)
        
        assert result.masculino == 0
        assert result.femenino == 0
        assert result.total == 0


class TestGetEstadisticasNutricionales:
    """Tests para _get_estadisticas_nutricionales"""
    
    @patch('reports.report_service.children_col')
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

    @patch('reports.report_service.children_col')
    def test_estadisticas_nutricionales_vacias(self, mock_children):
        """Test estadísticas nutricionales sin datos"""
        mock_children.aggregate.return_value = []
        
        result = _get_estadisticas_nutricionales({})
        
        assert result.normal == 0
        assert result.total == 0


class TestGetPromedios:
    """Tests para _get_promedios"""
    
    @patch('reports.report_service.children_col')
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

    @patch('reports.report_service.children_col')
    def test_promedios_sin_datos(self, mock_children):
        """Test cálculo de promedios sin datos"""
        mock_children.aggregate.return_value = []
        
        imc, edad = _get_promedios({})
        
        assert imc is None
        assert edad is None

    @patch('reports.report_service.children_col')
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
    
    @patch('reports.report_service.children_col')
    def test_instituciones_representadas(self, mock_children):
        """Test obtener instituciones representadas"""
        mock_children.distinct.return_value = ["Escuela A", "Escuela B", None, "Jardín C"]
        
        result = _get_instituciones_representadas({})
        
        assert result == ["Escuela A", "Escuela B", "Jardín C"]
        mock_children.distinct.assert_called_once_with("institucion", {})


class TestGenerarReporteGrupal:
    """Tests para generar_reporte_grupal"""
    
    @patch('reports.report_service._get_instituciones_representadas')
    @patch('reports.report_service._get_promedios')
    @patch('reports.report_service._get_estadisticas_nutricionales')
    @patch('reports.report_service._get_estadisticas_sexo')
    @patch('reports.report_service.children_col')
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

    @patch('reports.report_service._build_match_filter')
    @patch('reports.report_service.children_col')
    def test_reporte_grupal_con_filtros(self, mock_children, mock_filter):
        """Test reporte grupal con filtros"""
        filtros = ReportFilter(sexo="M", institucion="Escuela A")
        mock_filter.return_value = {"sexo": "M", "institucion": "Escuela A"}
        mock_children.count_documents.return_value = 15
        
        with patch('reports.report_service._get_estadisticas_sexo') as mock_sexo, \
             patch('reports.report_service._get_estadisticas_nutricionales') as mock_nutricional, \
             patch('reports.report_service._get_promedios') as mock_promedios, \
             patch('reports.report_service._get_instituciones_representadas') as mock_instituciones:
            
            mock_sexo.return_value = EstadisticasSexo(masculino=15, total=15)
            mock_nutricional.return_value = EstadisticasNutricionales(normal=12, total=15)
            mock_promedios.return_value = (17.8, 8.1)
            mock_instituciones.return_value = ["Escuela A"]
            
            reporte = generar_reporte_grupal(filtros)
            
            assert reporte.total_ninos == 15
            mock_filter.assert_called_once_with(filtros)


class TestGenerarReporteSeguimiento:
    """Tests para generar_reporte_seguimiento"""
    
    @patch('reports.report_service.children_col')
    @patch('reports.report_service.measurements_col')
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

    @patch('reports.report_service.children_col')
    def test_reporte_seguimiento_nino_no_encontrado(self, mock_children):
        """Test reporte de seguimiento cuando el niño no existe"""
        mock_children.find_one.return_value = None
        
        with pytest.raises(ValueError, match="no encontrado"):
            generar_reporte_seguimiento("507f1f77bcf86cd799439011")

    @patch('reports.report_service.children_col')
    @patch('reports.report_service.measurements_col')
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

    @patch('reports.report_service.children_col')
    @patch('reports.report_service.measurements_col')  
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