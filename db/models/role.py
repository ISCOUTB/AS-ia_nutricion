from pydantic import BaseModel, field_validator
from .base import BaseDBModel


class RoleCreate(BaseModel):
    name: str

    @field_validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre del rol es obligatorio')
        
        valid_roles = ['admin', 'doctor', 'enfermero', 'investigador', 'usuario']
        clean_name = v.strip().lower()
        
        if clean_name not in valid_roles:
            raise ValueError(f'Rol debe ser uno de: {", ".join(valid_roles)}')
        
        return clean_name


class RoleInDB(RoleCreate, BaseDBModel):
    pass