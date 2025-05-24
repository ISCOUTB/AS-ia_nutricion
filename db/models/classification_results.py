from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timezone
from typing import Optional
from .base import BaseDBModel, PyObjectId


class ClassificationResultCreate(BaseModel):
    child_id: PyObjectId
    resultado: str
    modelo: str
    fecha_resultado: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    confidence_score: Optional[float] = None

    @field_validator('resultado')
    def validate_resultado(cls, v):
        if not v or not v.strip():
            raise ValueError('El resultado es obligatorio')
        
        valid_results = [
            'desnutricion_aguda_severa',
            'desnutricion_aguda_moderada',
            'riesgo_desnutricion',
            'normal',
            'sobrepeso',
            'obesidad'
        ]
        
        clean_result = v.strip().lower()
        if clean_result not in valid_results:
            raise ValueError(f'Resultado debe ser uno de: {", ".join(valid_results)}')
        
        return clean_result

    @field_validator('modelo')
    def validate_modelo(cls, v):
        if not v or not v.strip():
            raise ValueError('El modelo es obligatorio')
        
        valid_models = [
            'random_forest_v1',
            'svm_v1',
            'neural_network_v1',
            'ensemble_v1'
        ]
        
        clean_model = v.strip().lower()
        if clean_model not in valid_models:
            raise ValueError(f'Modelo debe ser uno de: {", ".join(valid_models)}')
        
        return clean_model

    @field_validator('confidence_score')
    def validate_confidence_score(cls, v):
        if v is not None:
            if not (0 <= v <= 1):
                raise ValueError('El score de confianza debe estar entre 0 y 1')
        return v


class ClassificationResultInDB(ClassificationResultCreate, BaseDBModel):
    pass