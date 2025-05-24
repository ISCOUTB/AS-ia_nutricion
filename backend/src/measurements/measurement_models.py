from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import date
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    """Validador para ObjectId compatible con Pydantic"""
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)

class MeasurementCreate(BaseModel):
    """Modelo para crear una nueva medición"""
    child_id: PyObjectId
    peso: float  # kg
    talla: float  # cm
    fecha_medicion: date

    @field_validator('peso')
    @classmethod
    def validate_peso(cls, v):
        if v <= 0:
            raise ValueError('El peso debe ser mayor a 0')
        if v > 200:  # kg - límite razonable para niños
            raise ValueError('El peso parece excesivo para un niño')
        return v

    @field_validator('talla')
    @classmethod
    def validate_talla(cls, v):
        if v <= 0:
            raise ValueError('La talla debe ser mayor a 0')
        if v > 250:  # cm - límite razonable para niños
            raise ValueError('La talla parece excesiva para un niño')
        return v

    @field_validator('fecha_medicion')
    @classmethod
    def validate_fecha_medicion(cls, v):
        if v > date.today():
            raise ValueError('La fecha de medición no puede ser futura')
        return v

class Measurement(BaseModel):
    """Modelo completo de medición con IMC calculado"""
    id: Optional[str] = Field(alias="_id", default=None)
    child_id: PyObjectId
    peso: float  # kg
    talla: float  # cm
    imc: Optional[float] = None
    fecha_medicion: date

    @model_validator(mode="before")
    @classmethod
    def calcular_imc(cls, values):
        # Manejar tanto dict como objetos
        if isinstance(values, dict):
            peso = values.get("peso")
            talla = values.get("talla")
        else:
            peso = getattr(values, "peso", None)
            talla = getattr(values, "talla", None)
            
        if peso and talla:
            talla_m = talla / 100
            imc_calculado = round(peso / (talla_m ** 2), 2)
            if isinstance(values, dict):
                values["imc"] = imc_calculado
            else:
                values.imc = imc_calculado
        return values

    @field_validator('peso')
    @classmethod
    def validate_peso(cls, v):
        if v <= 0:
            raise ValueError('El peso debe ser mayor a 0')
        if v > 200:
            raise ValueError('El peso parece excesivo para un niño')
        return v

    @field_validator('talla')
    @classmethod
    def validate_talla(cls, v):
        if v <= 0:
            raise ValueError('La talla debe ser mayor a 0')
        if v > 250:
            raise ValueError('La talla parece excesiva para un niño')  
        return v

    @field_validator('fecha_medicion')
    @classmethod
    def validate_fecha_medicion(cls, v):
        if v > date.today():
            raise ValueError('La fecha de medición no puede ser futura')
        return v

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }