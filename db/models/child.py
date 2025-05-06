from pydantic import BaseModel
from datetime import date
from typing import Optional

class Child(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: str  # 'M' o 'F'
    direccion: str
    nombre_acudiente: str
    telefono_acudiente: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None
