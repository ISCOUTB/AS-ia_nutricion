from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date
from .base import BaseDBModel, PyObjectId


class BehavioralDataCreate(BaseModel):
    child_id: PyObjectId
    consumo_frutas: bool
    consumo_verduras: bool
    actividad_fisica: bool
    tiempo_pantalla: Optional[float] = None  # horas/día
    fecha_registro: Optional[date] = Field(default_factory=date.today)

    @field_validator('tiempo_pantalla')
    def validate_tiempo_pantalla(cls, v):
        if v is not None:
            if v < 0:
                raise ValueError('El tiempo de pantalla no puede ser negativo')
            if v > 24:
                raise ValueError('El tiempo de pantalla no puede exceder 24 horas al día')
        return v

    @field_validator('fecha_registro')
    def validate_fecha_registro(cls, v):
        if v and v > date.today():
            raise ValueError('La fecha de registro no puede ser futura')
        return v


class BehavioralDataInDB(BehavioralDataCreate, BaseDBModel):
    pass