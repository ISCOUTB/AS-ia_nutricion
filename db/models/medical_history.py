from pydantic import BaseModel
from typing import Optional
from datetime import date

class MedicalHistory(BaseModel):
    child_id: str  # referencia a _id del niño
    enfermedades: Optional[str] = None
    medicamentos: Optional[str] = None
    alergias: Optional[str] = None
    antecedentes_familiares: Optional[str] = None
    fecha_registro: date
