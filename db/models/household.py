from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId


class PyObjectId(ObjectId):
    """Validador para que Pydantic maneje ObjectId correctamente"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("ID no válido para ObjectId")

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class HouseholdCreate(BaseModel):
    location_type: str  # "urbano" o "rural"
    caregiver_education_level: Optional[str]
    monthly_income: Optional[float]
    food_security: Optional[str]  # "seguro", "moderado", "grave"
    water_access: Optional[bool]
    government_aid: Optional[List[str]] = Field(default_factory=list)


class HouseholdInDB(HouseholdCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
