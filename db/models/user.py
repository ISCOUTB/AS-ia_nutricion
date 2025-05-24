from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime, timezone
from typing import Optional
from .base import BaseDBModel, PyObjectId


class UserCreate(BaseModel):
    email: EmailStr
    password_hash: str
    role_id: PyObjectId

    @field_validator('password_hash')
    def validate_password_hash(cls, v):
        if not v or not v.strip():
            raise ValueError('El hash de contraseña es obligatorio')
        
        # Validar que parece un hash válido (ajusta según tu algoritmo de hash)
        # Ejemplo para bcrypt: debe empezar con $2b$ y tener longitud específica
        if not (v.startswith('$2b$') and len(v) == 60):
            raise ValueError('El hash de contraseña no tiene un formato válido (debe ser bcrypt)')
        
        return v

    @field_validator('email')
    def validate_email_format(cls, v):
        # Validación adicional más allá de EmailStr si es necesario
        email_str = str(v).lower().strip()
        if len(email_str) > 254:  # RFC 5321 limit
            raise ValueError('El email es demasiado largo')
        return email_str


class UserInDB(UserCreate, BaseDBModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    last_login: Optional[datetime] = None
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None

    @field_validator('failed_login_attempts')
    def validate_failed_attempts(cls, v):
        if v < 0:
            raise ValueError('Los intentos fallidos no pueden ser negativos')
        return v