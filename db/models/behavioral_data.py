from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class BehavioralData(BaseModel):
    id: Optional[str] = Field(alias="_id")
    child_id: str
    consumo_frutas: bool
    consumo_verduras: bool
    actividad_fisica: bool
    tiempo_pantalla: Optional[float]  # horas/día
    fecha_registro: date

    class Config:
        allow_population_by_field_name = True
