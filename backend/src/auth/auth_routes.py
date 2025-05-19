from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from . import auth_service
from .auth_models import UserRegister, UserLogin, Token
from typing import Dict

auth_router = APIRouter(prefix="/auth", tags=["Autenticación"])

# Ruta de registro
@auth_router.post("/register", response_model=Dict[str, str])
def register(user_data: UserRegister):
    result = auth_service.register_user(user_data.email, user_data.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado"
        )
    return result

# Ruta de login con OAuth2PasswordRequestForm (formulario estándar)
@auth_router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    result = auth_service.authenticate_user(form_data.username, form_data.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    return result

# Ruta para renovar token usando refresh token
@auth_router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str):
    result = auth_service.refresh_access_token(refresh_token)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de refresco inválido o expirado"
        )
    return result
