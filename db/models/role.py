from pydantic import BaseModel
from typing import Optional
from pydantic import Field

class Role(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str

    class Config:
        allow_population_by_field_name = True
