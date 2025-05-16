from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

# Filtros generales para reportes grupales e individuales
class ReportFilter(BaseModel):
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None
    genero: Optional[str] = Field(None, description="M o F")
    rango_edad_min: Optional[int] = Field(None, description="Edad mínima en años")
    rango_edad_max: Optional[int] = Field(None, description="Edad máxima en años")
    region: Optional[str] = None  # Podrías usar barrio o institucion según modelo


# Modelo para reporte individual simplificado
class ReporteIndividual(BaseModel):
    child_id: str
    nombre: str
    apellido: str
    fecha_nacimiento: date
    sexo: str
    mediciones: List[dict]  # Lista con dicts que contengan peso, talla, imc, fecha, etc.
    clasificaciones: List[dict]  # Resultado del modelo ML, fechas, probabilidad, etc.
    recomendaciones: Optional[List[str]] = []


# Modelo para reporte grupal simplificado
class ReporteGrupal(BaseModel):
    total_niños: int
    distribución_estado_nutricional: dict  # Ej: {"Normal": 40, "Riesgo": 10, "Desnutrición": 5}
    promedio_imc: Optional[float] = None
    tendencias: Optional[List[dict]] = None  # Ej: [{"fecha": date, "imc_promedio": 16.5}, ...]
