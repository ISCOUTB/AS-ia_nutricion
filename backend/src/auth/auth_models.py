from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Para crear un usuario nuevo (registro)
class UserRegister(BaseModel):
    email: EmailStr
    password: str

# Para iniciar sesión
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Para respuesta con token JWT
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None  # incluir si lo devuelves
    token_type: str = "bearer"

# Para extraer datos del token (ej: en dependencias de seguridad)
class TokenData(BaseModel):
    sub: Optional[str] = None  # ID del usuario
    exp: Optional[int] = None  # fecha de expiración (opcional)

# Opcional: para representar al usuario autenticado (sin contraseña)
class UserOut(BaseModel):
    id: str
    email: EmailStr
    is_active: bool
    created_at: datetime
