from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler
from datetime import datetime
from typing import Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    """Permite que ObjectId funcione correctamente en Pydantic"""
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
    def __get_pydantic_json_schema__(cls, core_schema, handler: GetJsonSchemaHandler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema


# Modelo base para creación de usuario (entrada)
class UserCreate(BaseModel):
    #username: str #Para dar más personalización al usuario, pero luego
    email: EmailStr
    password_hash: str
    role_id: str  # ID de la colección roles

# Modelo completo que representa un usuario en la base de datos
class UserInDB(UserCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
