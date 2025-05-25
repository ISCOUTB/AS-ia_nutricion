from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from . import auth_service
from .auth_models import (
    UserRegister, 
    UserLogin, 
    Token, 
    UserOut, 
    PasswordChange, 
    PasswordReset, 
    PasswordResetConfirm,
    RefreshTokenRequest
)
from .auth_utils import verify_access_token
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

# Configuración OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

auth_router = APIRouter(prefix="/auth", tags=["Autenticación"])

def get_client_ip(request: Request) -> str:
    """Obtener IP del cliente"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserOut:
    """Dependencia para obtener usuario actual autenticado"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = verify_access_token(token)
        if payload is None:
            raise credentials_exception
            
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        user = auth_service.get_current_user(user_id)
        if user is None:
            raise credentials_exception
            
        return user
    except Exception as e:
        logger.error(f"Error en get_current_user: {e}")
        raise credentials_exception

async def get_current_active_user(current_user: UserOut = Depends(get_current_user)) -> UserOut:
    """Dependencia para obtener usuario activo"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Usuario inactivo"
        )
    return current_user

async def require_admin(current_user: UserOut = Depends(get_current_active_user)) -> UserOut:
    """Dependencia para requerir permisos de administrador"""
    if current_user.role_name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos suficientes"
        )
    return current_user

# === RUTAS DE AUTENTICACIÓN ===

@auth_router.post("/register", response_model=Dict[str, str], status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, request: Request):
    """Registro de nuevo usuario"""
    try:
        client_ip = get_client_ip(request)
        result = auth_service.register_user(
            email=user_data.email,
            password=user_data.password,
            role_name=user_data.role_name,
            ip_address=client_ip
        )
        
        if "error" in result:
            if "ya está registrado" in result["error"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=result["error"]
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=result["error"]
                )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en registro: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@auth_router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), request: Request = None):
    """Iniciar sesión con formulario OAuth2 estándar"""
    try:
        client_ip = get_client_ip(request) if request else None
        result = auth_service.authenticate_user(
            email=form_data.username,  # OAuth2 usa 'username' para el email
            password=form_data.password,
            ip_address=client_ip
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return Token(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@auth_router.post("/login-json", response_model=Token)
async def login_with_json(user_login: UserLogin, request: Request):
    """Iniciar sesión con JSON (alternativa al formulario OAuth2)"""
    try:
        client_ip = get_client_ip(request)
        result = auth_service.authenticate_user(
            email=user_login.email,
            password=user_login.password,
            ip_address=client_ip
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return Token(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en login JSON: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@auth_router.post("/refresh", response_model=Token)
async def refresh_token(token_request: RefreshTokenRequest, request: Request):
    """Renovar token de acceso usando refresh token"""
    try:
        client_ip = get_client_ip(request)
        result = auth_service.refresh_access_token(token_request.refresh_token, client_ip)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de refresco inválido o expirado"
            )
        
        return Token(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en refresh token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# === RUTAS DE PERFIL DE USUARIO ===

@auth_router.get("/me", response_model=UserOut)
async def read_users_me(current_user: UserOut = Depends(get_current_active_user)):
    """Obtener información del usuario actual"""
    return current_user

@auth_router.post("/change-password", response_model=Dict[str, str])
async def change_password(
    password_data: PasswordChange,
    request: Request,
    current_user: UserOut = Depends(get_current_active_user)
):
    """Cambiar contraseña del usuario actual"""
    try:
        client_ip = get_client_ip(request)
        success = auth_service.change_password(
            user_id=current_user.id,
            current_password=password_data.current_password,
            new_password=password_data.new_password,
            ip_address=client_ip
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contraseña actual incorrecta"
            )
        
        return {"message": "Contraseña cambiada exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al cambiar contraseña: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# === RUTAS DE RECUPERACIÓN DE CONTRASEÑA ===

@auth_router.post("/password-reset", response_model=Dict[str, str])
async def request_password_reset(password_reset: PasswordReset, request: Request):
    """Solicitar reset de contraseña"""
    try:
        client_ip = get_client_ip(request)
        token = auth_service.request_password_reset(
            email=password_reset.email,
            ip_address=client_ip
        )
        
        # TODO: Aquí deberías enviar el token por email al usuario
        # Por ejemplo: send_password_reset_email(password_reset.email, token)
        
        # DESARROLLO: Devolver el token solo en modo desarrollo
        import os
        if os.getenv("ENVIRONMENT") == "development" and token:
            return {
                "message": "Token generado (solo desarrollo)",
                "reset_token": token
            }
        
        # Por seguridad, siempre devolvemos el mismo mensaje
        # independientemente de si el email existe o no
        return {
            "message": "Si el correo existe, recibirás instrucciones para resetear tu contraseña"
        }
        
    except Exception as e:
        logger.error(f"Error en password reset request: {e}")
        # No revelamos el error específico por seguridad
        return {
            "message": "Si el correo existe, recibirás instrucciones para resetear tu contraseña"
        }

@auth_router.post("/password-reset-confirm", response_model=Dict[str, str])
async def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    request: Request
):
    """Confirmar reset de contraseña con token"""
    try:
        client_ip = get_client_ip(request)
        success = auth_service.reset_password(
            token=reset_data.token,
            new_password=reset_data.new_password,
            ip_address=client_ip
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token inválido o expirado"
            )
        
        return {"message": "Contraseña reseteada exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en password reset confirm: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# === RUTAS ADMINISTRATIVAS ===

@auth_router.get("/users", response_model=List[UserOut])
async def get_all_users(admin_user: UserOut = Depends(require_admin)):
    """Obtener todos los usuarios (solo administradores)"""
    try:
        users = auth_service.get_all_users()
        return users
        
    except Exception as e:
        logger.error(f"Error al obtener usuarios: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# === RUTAS DE UTILIDAD ===

@auth_router.get("/verify-token", response_model=Dict[str, str])
async def verify_token(current_user: UserOut = Depends(get_current_active_user)):
    """Verificar si el token actual es válido"""
    return {
        "message": "Token válido",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role_name
    }