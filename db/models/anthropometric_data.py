from pydantic import BaseModel, field_validator
from datetime import date
from .base import BaseDBModel, PyObjectId


class AnthropometricDataCreate(BaseModel):
    child_id: PyObjectId
    peso: float
    talla: float
    imc: float
    fecha_medicion: date

    @field_validator('peso')
    def validate_peso(cls, v):
        if v <= 0:
            raise ValueError('El peso debe ser mayor a 0')
        if v > 200:  # kg - límite razonable para niños
            raise ValueError('El peso parece excesivo para un niño')
        return v

    @field_validator('talla')
    def validate_talla(cls, v):
        if v <= 0:
            raise ValueError('La talla debe ser mayor a 0')
        if v > 250:  # cm - límite razonable para niños
            raise ValueError('La talla parece excesiva para un niño')
        return v

    @field_validator('imc')
    def validate_imc(cls, v):
        if v <= 0:
            raise ValueError('El IMC debe ser mayor a 0')
        if v > 50:  # límite razonable
            raise ValueError('El IMC parece excesivo')
        return v

    @field_validator('fecha_medicion')
    def validate_fecha_medicion(cls, v):
        if v > date.today():
            raise ValueError('La fecha de medición no puede ser futura')
        return v

    # Validación cruzada para verificar que el IMC sea consistente
    @field_validator('imc')
    def validate_imc_consistency(cls, v, values):
        if 'peso' in values and 'talla' in values:
            peso = values['peso']
            talla_m = values['talla'] / 100  # convertir cm a metros
            imc_calculado = peso / (talla_m ** 2)
            # Permitir una pequeña diferencia por redondeo
            if abs(v - imc_calculado) > 0.5:
                raise ValueError(f'El IMC no es consistente con peso y talla. Calculado: {imc_calculado:.2f}')
        return v


class AnthropometricDataInDB(AnthropometricDataCreate, BaseDBModel):
    pass