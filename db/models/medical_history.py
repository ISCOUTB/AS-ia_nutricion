from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date
from .base import BaseDBModel, PyObjectId


class MedicalHistoryCreate(BaseModel):
    child_id: PyObjectId
    enfermedades: Optional[str] = None
    medicamentos: Optional[str] = None
    alergias: Optional[str] = None
    antecedentes_familiares: Optional[str] = None
    fecha_registro: Optional[date] = Field(default_factory=date.today)

    @field_validator('fecha_registro')
    def validate_fecha_registro(cls, v):
        if v and v > date.today():
            raise ValueError('La fecha de registro no puede ser futura')
        return v

    @field_validator('enfermedades', 'medicamentos', 'alergias', 'antecedentes_familiares')
    def validate_text_fields(cls, v):
        if v is not None:
            v = v.strip()
            if not v:  # Si es string vacío después del strip
                return None
            if len(v) > 1000:  # Límite razonable de caracteres
                raise ValueError('El texto no puede exceder 1000 caracteres')
        return v


class MedicalHistoryInDB(MedicalHistoryCreate, BaseDBModel):
    pass