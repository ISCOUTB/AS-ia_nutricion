from pydantic import BaseModel, Field, GetJsonSchemaHandler
from typing import Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Validador para ObjectId compatible con Pydantic"""
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


class AuditLogCreate(BaseModel):
    user_id: str
    action: str
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    details: Optional[str] = None


class AuditLogInDB(AuditLogCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
