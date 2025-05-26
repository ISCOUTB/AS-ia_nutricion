from typing import Union
from pydantic import BaseModel

class EstadoNutricionalInput(BaseModel):
    location_type: str
    caregiver_education_level: str
    monthly_income: float
    food_security: str
    water_access: bool
    enfermedades: Union[int, bool]
    medicamentos: Union[int, bool]
    alergias: Union[int, bool]
    antecedentes_familiares: Union[int, bool]
    consumo_frutas: Union[int, bool]
    consumo_verduras: Union[int, bool]
    actividad_fisica: Union[int, bool]
    tiempo_pantalla: float
    peso: float
    talla: float
    imc: float