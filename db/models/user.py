from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler
from datetime import datetime, timezone
from typing import Optional, Any
from bson import ObjectId
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    """Permite que ObjectId funcione correctamente en Pydantic"""
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


# Modelo base para creación de usuario (entrada)
class UserCreate(BaseModel):
    #username: str #Para dar más personalización al usuario, pero luego
    email: EmailStr
    password_hash: str
    role_id: str  # ID de la colección roles

# Modelo completo que representa un usuario en la base de datos
class UserInDB(UserCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    is_active: bool = True

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }
