from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class MedicalHistory(BaseModel):
    id: Optional[str] = Field(alias="_id")
    child_id: str  # ObjectId en str
    enfermedades: Optional[str] = None
    medicamentos: Optional[str] = None
    alergias: Optional[str] = None
    antecedentes_familiares: Optional[str] = None
    fecha_registro: date

    class Config:
        allow_population_by_field_name = True
