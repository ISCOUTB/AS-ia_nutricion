from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional
from .base import BaseDBModel, SexoEnum


class ChildCreate(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: SexoEnum
    direccion: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: str
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: str
    consentimiento_informado: bool

    @field_validator('consentimiento_informado')
    def validate_consentimiento(cls, v):
        if not v:
            raise ValueError('El consentimiento informado debe ser True para crear un registro')
        return v

    @field_validator('nombre', 'apellido', 'nombre_acudiente')
    def validate_names(cls, v):
        if not v or not v.strip():
            raise ValueError('Los nombres no pueden estar vacíos')
        return v.strip().title()

    @field_validator('documento')
    def validate_documento(cls, v):
        if not v or not v.strip():
            raise ValueError('El documento es obligatorio')
        return v.strip()

    @field_validator('telefono_acudiente')
    def validate_telefono(cls, v):
        if not v or not v.strip():
            raise ValueError('El teléfono del acudiente es obligatorio')
        # Validación básica de formato de teléfono (puedes ajustar según tu país)
        clean_phone = v.strip().replace(' ', '').replace('-', '')
        if not clean_phone.isdigit() or len(clean_phone) < 7:
            raise ValueError('Formato de teléfono inválido')
        return v.strip()

    @field_validator('fecha_nacimiento')
    def validate_fecha_nacimiento(cls, v):
        if v > date.today():
            raise ValueError('La fecha de nacimiento no puede ser futura')
        # Validar edad mínima y máxima razonable (ej: 0-18 años)
        age = (date.today() - v).days // 365
        if age > 18:
            raise ValueError('La edad no puede ser mayor a 18 años')
        return v


class ChildInDB(ChildCreate, BaseDBModel):
    pass