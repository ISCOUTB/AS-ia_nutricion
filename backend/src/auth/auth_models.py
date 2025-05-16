from pydantic import BaseModel, EmailStr
from typing import Optional

# Para crear un usuario nuevo (registro)
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Para login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Para respuesta con token JWT
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Para extraer datos del token
class TokenData(BaseModel):
    user_id: Optional[str] = None
