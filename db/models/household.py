from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from .base import BaseDBModel, LocationTypeEnum, FoodSecurityEnum


class HouseholdCreate(BaseModel):
    location_type: LocationTypeEnum
    caregiver_education_level: Optional[str] = None
    monthly_income: Optional[float] = None
    food_security: Optional[FoodSecurityEnum] = None
    water_access: Optional[bool] = None
    government_aid: Optional[List[str]] = Field(default_factory=list)

    @field_validator('monthly_income')
    def validate_monthly_income(cls, v):
        if v is not None and v < 0:
            raise ValueError('El ingreso mensual no puede ser negativo')
        return v

    @field_validator('caregiver_education_level')
    def validate_education_level(cls, v):
        if v is not None:
            valid_levels = [
                'sin_educacion',
                'primaria_incompleta',
                'primaria_completa',
                'secundaria_incompleta',
                'secundaria_completa',
                'tecnica',
                'universitaria_incompleta',
                'universitaria_completa',
                'posgrado'
            ]
            if v not in valid_levels:
                raise ValueError(f'Nivel educativo debe ser uno de: {", ".join(valid_levels)}')
        return v

    @field_validator('government_aid')
    def validate_government_aid(cls, v):
        if v:
            # Validar que sean programas conocidos (ajusta según tu país)
            valid_aids = [
                'familias_en_accion',
                'joven_en_accion',
                'colombia_mayor',
                'subsidio_vivienda',
                'sisben',
                'otro'
            ]
            for aid in v:
                if aid not in valid_aids:
                    raise ValueError(f'Ayuda gubernamental "{aid}" no reconocida. Válidas: {", ".join(valid_aids)}')
        return v or []


class HouseholdInDB(HouseholdCreate, BaseDBModel):
    pass