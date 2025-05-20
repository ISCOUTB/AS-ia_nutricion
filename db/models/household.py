from pydantic import BaseModel, Field, GetJsonSchemaHandler
from typing import Optional, List, Any
from pydantic_core import core_schema
from bson import ObjectId


class PyObjectId(ObjectId):
    """Validador para que Pydantic maneje ObjectId correctamente"""
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: Any) -> core_schema.CoreSchema:
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler) -> dict:
        return {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{24}$",
        }


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
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }
