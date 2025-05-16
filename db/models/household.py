from pydantic import BaseModel, Field
from typing import Optional, List

class Household(BaseModel):
    id: Optional[str] = Field(alias="_id")
    location_type: str  # "urbano" o "rural"
    caregiver_education_level: Optional[str]
    monthly_income: Optional[float]
    food_security: Optional[str]  # "seguro", "moderado", "grave"
    water_access: Optional[bool]
    government_aid: Optional[List[str]] = []

    class Config:
        allow_population_by_field_name = True
