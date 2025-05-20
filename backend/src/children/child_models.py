from pydantic import BaseModel, Field, GetJsonSchemaHandler
from datetime import date
from typing import Optional
from bson import ObjectId

# === PyObjectId para compatibilidad con MongoDB ===
class PyObjectId(ObjectId):
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

# === Modelo base (para respuestas o updates parciales) ===
class ChildBase(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    tipo_documento: Optional[str] = None
    documento: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    sexo: Optional[str] = None  # "M" o "F"
    direccion: Optional[str] = None
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: Optional[str] = None
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: Optional[str] = None
    consentimiento_informado: Optional[bool] = None

# === Modelo para crear un nuevo niño ===
class ChildCreate(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: str
    direccion: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: str
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: str
    consentimiento_informado: bool = False

# === Modelo para actualizar (todos los campos opcionales) ===
class ChildUpdate(ChildBase):
    pass

# === Modelo completo para respuesta desde la DB ===
class ChildInResponse(ChildCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
