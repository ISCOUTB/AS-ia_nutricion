from pydantic import BaseModel, Field, GetJsonSchemaHandler
from datetime import date
from typing import Optional, Any
from pydantic_core import core_schema
from bson import ObjectId


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


class ChildCreate(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: str  # 'M' o 'F'
    direccion: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: str
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: str
    consentimiento_informado: bool = False


class ChildInDB(ChildCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }
