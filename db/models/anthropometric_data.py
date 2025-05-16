from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class AnthropometricData(BaseModel):
    id: Optional[str] = Field(alias="_id")
    child_id: str
    peso: float
    talla: float
    imc: float
    fecha_medicion: date

    class Config:
        allow_population_by_field_name = True
