from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ClassificationResult(BaseModel):
    id: Optional[str] = Field(alias="_id")
    child_id: str
    resultado: str
    modelo: str
    fecha_resultado: datetime

    class Config:
        allow_population_by_field_name = True
