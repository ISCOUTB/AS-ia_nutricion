from pydantic import BaseModel, EmailStr
from typing import Optional

# Para crear un usuario nuevo (registro)
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Opcional: si deseas usar login con JSON en lugar de OAuth2PasswordRequestForm
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
    sub: Optional[str] = None  # para coincidir con el campo usado en el JWT
