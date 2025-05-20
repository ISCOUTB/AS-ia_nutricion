from pydantic import BaseModel, Field, model_validator
from datetime import date
from typing import Optional
from bson import ObjectId

class Measurement(BaseModel):
    id: Optional[str] = Field(alias="_id")
    child_id: str
    peso: float  # kg
    talla: float  # cm
    imc: Optional[float] = None
    fecha_medicion: date

    @model_validator(mode="before")
    @classmethod
    def calcular_imc(cls, values):
        peso = values.get("peso")
        talla = values.get("talla")
        if peso and talla:
            talla_m = talla / 100
            values["imc"] = round(peso / (talla_m ** 2), 2)
        return values

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }
