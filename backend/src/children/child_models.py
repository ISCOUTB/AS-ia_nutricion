from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class Child(BaseModel):
    id: Optional[str] = Field(alias="_id")
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: str  # "M" o "F"
    direccion: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None

    # Datos del acudiente
    nombre_acudiente: str
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: str

    consentimiento_informado: bool = False

    class Config:
        allow_population_by_field_name = True
