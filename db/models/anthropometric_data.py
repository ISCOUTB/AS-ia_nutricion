from pydantic import BaseModel, Field, GetJsonSchemaHandler
from datetime import date
from typing import Optional, Any
from bson import ObjectId
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    """Validador para ObjectId compatible con Pydantic"""
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


class AnthropometricDataCreate(BaseModel):
    child_id: str
    peso: float
    talla: float
    imc: float
    fecha_medicion: date


class AnthropometricDataInDB(AnthropometricDataCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }
