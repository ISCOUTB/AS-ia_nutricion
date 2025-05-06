from pydantic import BaseModel
from datetime import date

class AnthropometricData(BaseModel):
    child_id: str
    peso: float  # en kg
    talla: float  # en cm
    imc: float
    fecha_medicion: date
