from typing import Union
from pydantic import BaseModel, Field, field_validator


class EstadoNutricionalInput(BaseModel):
    """Modelo para los datos de entrada de predicción nutricional"""
    location_type: str
    caregiver_education_level: str
    monthly_income: float = Field(..., ge=0)
    food_security: str
    water_access: Union[bool, int]
    enfermedades: Union[int, bool]
    medicamentos: Union[int, bool]
    alergias: Union[int, bool]
    antecedentes_familiares: Union[int, bool]
    consumo_frutas: Union[int, bool]
    consumo_verduras: Union[int, bool]
    actividad_fisica: Union[int, bool]
    tiempo_pantalla: float = Field(..., ge=0)
    peso: float = Field(..., gt=0)
    talla: float = Field(..., gt=0)
    imc: float = Field(..., gt=0)

    @field_validator('location_type')
    @classmethod
    def validate_location_type(cls, v):
        valid_types = ['urbano', 'rural']
        if v.lower().strip() not in valid_types:
            raise ValueError(f'location_type debe ser uno de: {", ".join(valid_types)}')
        return v.lower().strip()

    @field_validator('caregiver_education_level')
    @classmethod
    def validate_education_level(cls, v):
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
        if v.lower().strip() not in valid_levels:
            raise ValueError(f'caregiver_education_level debe ser uno de: {", ".join(valid_levels)}')
        return v.lower().strip()

    @field_validator('food_security')
    @classmethod
    def validate_food_security(cls, v):
        valid_security = ['seguro', 'moderado', 'grave']
        if v.lower().strip() not in valid_security:
            raise ValueError(f'food_security debe ser uno de: {", ".join(valid_security)}')
        return v.lower().strip()

    @field_validator('enfermedades', 'medicamentos', 'alergias', 'antecedentes_familiares', 
                    'consumo_frutas', 'consumo_verduras', 'actividad_fisica', 'water_access')
    @classmethod
    def validate_binary_fields(cls, v):
        if isinstance(v, bool):
            return v
        elif isinstance(v, int) and v in (0, 1):
            return v
        else:
            raise ValueError('Los campos binarios deben ser 0, 1, True o False')


# Constantes útiles para validaciones en otros módulos
VALID_NUTRITIONAL_STATES = [
    'desnutricion_aguda_severa',
    'desnutricion_aguda_moderada', 
    'riesgo_desnutricion',
    'normal',
    'sobrepeso',
    'obesidad'
]

VALID_MODELS = [
    'random_forest_v1',
    'svm_v1', 
    'neural_network_v1',
    'ensemble_v1'
]