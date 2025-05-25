from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from db.models.base import PyObjectId

# Para crear un usuario nuevo (registro)
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role_name: Optional[str] = "usuario"  # rol por defecto

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('La contraseña debe tener al menos una mayúscula')
        if not any(c.islower() for c in v):
            raise ValueError('La contraseña debe tener al menos una minúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('La contraseña debe tener al menos un número')
        return v

    @field_validator('role_name')
    def validate_role_name(cls, v):
        if v is not None:
            valid_roles = ['admin', 'doctor', 'enfermero', 'investigador', 'usuario']
            if v.lower() not in valid_roles:
                raise ValueError(f'Rol debe ser uno de: {", ".join(valid_roles)}')
            return v.lower()
        return "usuario"

# Para iniciar sesión
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Para respuesta con token JWT
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int  # segundos hasta expiración
    
class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Para extraer datos del token (ej: en dependencias de seguridad)
class TokenData(BaseModel):
    sub: Optional[str] = None  # ID del usuario
    exp: Optional[int] = None  # fecha de expiración
    role: Optional[str] = None  # rol del usuario

# Para representar al usuario autenticado (sin contraseña)
class UserOut(BaseModel):
    id: str
    email: str
    role_name: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

# Para cambiar contraseña
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('La nueva contraseña debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('La nueva contraseña debe tener al menos una mayúscula')
        if not any(c.islower() for c in v):
            raise ValueError('La nueva contraseña debe tener al menos una minúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('La nueva contraseña debe tener al menos un número')
        return v

# Para reset de contraseña
class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

    @field_validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('La nueva contraseña debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('La nueva contraseña debe tener al menos una mayúscula')
        if not any(c.islower() for c in v):
            raise ValueError('La nueva contraseña debe tener al menos una minúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('La nueva contraseña debe tener al menos un número')
        return v