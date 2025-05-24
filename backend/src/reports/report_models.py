from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict
from datetime import date, datetime
from db.models.base import PyObjectId

# Filtros generales para reportes
class ReportFilter(BaseModel):
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    sexo: Optional[str] = Field(None, description="M o F")
    rango_edad_min: Optional[int] = Field(None, description="Edad mínima en años")
    rango_edad_max: Optional[int] = Field(None, description="Edad máxima en años")
    institucion: Optional[str] = None
    barrio: Optional[str] = None

    @field_validator('sexo')
    def validate_sexo(cls, v):
        if v is not None and v not in ['M', 'F']:
            raise ValueError('El sexo debe ser M o F')
        return v

    @field_validator('rango_edad_min', 'rango_edad_max')
    def validate_edad_range(cls, v):
        if v is not None and (v < 0 or v > 18):
            raise ValueError('La edad debe estar entre 0 y 18 años')
        return v


# Datos de medición para reportes
class MedicionReporte(BaseModel):
    peso: float
    talla: float
    imc: float
    fecha_medicion: date


# Datos de clasificación para reportes
class ClasificacionReporte(BaseModel):
    resultado: str
    modelo: str
    fecha_resultado: datetime
    confidence_score: Optional[float] = None


# Modelo para reporte individual
class ReporteIndividual(BaseModel):
    child_id: str
    nombre: str
    apellido: str
    fecha_nacimiento: date
    sexo: str
    edad_actual: int
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    mediciones: List[MedicionReporte] = []
    clasificaciones: List[ClasificacionReporte] = []
    ultima_clasificacion: Optional[str] = None
    tendencia_imc: Optional[str] = None  # "mejorando", "estable", "empeorando"


# Estadísticas por estado nutricional
class EstadisticasNutricionales(BaseModel):
    normal: int = 0
    riesgo_desnutricion: int = 0
    desnutricion_aguda_moderada: int = 0
    desnutricion_aguda_severa: int = 0
    sobrepeso: int = 0
    obesidad: int = 0
    total: int = 0


# Estadísticas por sexo
class EstadisticasSexo(BaseModel):
    masculino: int = 0
    femenino: int = 0
    total: int = 0


# Modelo para reporte grupal
class ReporteGrupal(BaseModel):
    total_ninos: int
    estadisticas_nutricionales: EstadisticasNutricionales
    estadisticas_sexo: EstadisticasSexo
    promedio_imc_general: Optional[float] = None
    promedio_edad: Optional[float] = None
    instituciones_representadas: List[str] = []
    fecha_generacion: datetime = Field(default_factory=datetime.now)


# Modelo para reporte de seguimiento (evolución de un niño)
class ReporteSeguimiento(BaseModel):
    child_id: str
    nombre: str
    apellido: str
    total_mediciones: int
    primera_medicion: Optional[date] = None
    ultima_medicion: Optional[date] = None
    cambio_peso: Optional[float] = None  # kg
    cambio_talla: Optional[float] = None  # cm
    cambio_imc: Optional[float] = None
    meses_seguimiento: Optional[int] = None