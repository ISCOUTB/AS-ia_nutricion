from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from bson import ObjectId


class PyObjectId(ObjectId):
    """Validador personalizado para ObjectId"""
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


class MedicalHistoryCreate(BaseModel):
    child_id: str  # Puede mantenerse como str si llega así desde la API
    enfermedades: Optional[str] = None
    medicamentos: Optional[str] = None
    alergias: Optional[str] = None
    antecedentes_familiares: Optional[str] = None
    fecha_registro: Optional[date] = Field(default_factory=date.today)


class MedicalHistoryInDB(MedicalHistoryCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
