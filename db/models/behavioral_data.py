from pydantic import BaseModel
from typing import Optional
from datetime import date

class BehavioralData(BaseModel):
    child_id: str
    consumo_frutas: bool
    consumo_verduras: bool
    actividad_fisica: bool
    tiempo_pantalla: Optional[float]  # en horas por día
    fecha_registro: date
