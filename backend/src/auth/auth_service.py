from db.database import db
from db.models.user import UserCreate, UserInDB
from db.models.role import RoleCreate, RoleInDB
from .auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    create_password_reset_token,
    verify_password_reset_token,
    get_access_token_expire_seconds
)
from .auth_models import UserOut
from bson import ObjectId
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, List
import logging

logger = logging.getLogger(__name__)

# Conexión a las colecciones
users_collection = db["users"]
roles_collection = db["roles"]
audit_log_collection = db["audit_log"]

def _log_audit(user_id: Optional[str], action: str, details: Optional[str] = None, ip_address: Optional[str] = None):
    """Registrar acción en audit log"""
    try:
        if user_id:
            audit_log_collection.insert_one({
                "user_id": ObjectId(user_id),
                "action": action,
                "timestamp": datetime.now(timezone.utc),
                "ip_address": ip_address,
                "details": details
            })
    except Exception as e:
        logger.error(f"Error al registrar audit log: {e}")

def _ensure_default_roles():
    """Asegurar que existan los roles por defecto"""
    default_roles = ['admin', 'doctor', 'enfermero', 'investigador', 'usuario']
    
    for role_name in default_roles:
        if not roles_collection.find_one({"name": role_name}):
            try:
                role_data = RoleCreate(name=role_name)
                roles_collection.insert_one(role_data.model_dump(by_alias=True, exclude={"id"}))
                logger.info(f"Rol '{role_name}' creado")
            except Exception as e:
                logger.error(f"Error al crear rol '{role_name}': {e}")

def get_role_by_name(role_name: str) -> Optional[Dict]:
    """Obtener rol por nombre"""
    try:
        return roles_collection.find_one({"name": role_name.lower()})
    except Exception as e:
        logger.error(f"Error al obtener rol: {e}")
        return None

def get_user_by_id(user_id: str) -> Optional[Dict]:
    """Obtener usuario por ID"""
    try:
        if not ObjectId.is_valid(user_id):
            return None
        return users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        logger.error(f"Error al obtener usuario: {e}")
        return None

def get_user_by_email(email: str) -> Optional[Dict]:
    """Obtener usuario por email"""
    try:
        return users_collection.find_one({"email": email.lower()})
    except Exception as e:
        logger.error(f"Error al obtener usuario por email: {e}")
        return None

def register_user(email: str, password: str, role_name: str = "usuario", ip_address: Optional[str] = None) -> Optional[Dict[str, str]]:
    """Registro de usuario"""
    try:
        # Normalizar email
        email = email.lower().strip()
        
        # Verificar si ya existe un usuario con ese email
        if get_user_by_email(email):
            return {"error": "El correo ya está registrado"}

        # Asegurar que existan los roles por defecto
        _ensure_default_roles()
        
        # Obtener el rol
        role = get_role_by_name(role_name)
        if not role:
            return {"error": f"Rol '{role_name}' no encontrado"}

        # Crear usuario
        user_data = UserCreate(
            email=email,
            password_hash=hash_password(password),
            role_id=role["_id"]
        )

        result = users_collection.insert_one(user_data.model_dump(by_alias=True, exclude={"id"}))
        user_id = str(result.inserted_id)
        
        # Registrar en audit log
        _log_audit(user_id, "register", f"Usuario registrado con rol {role_name}", ip_address)
        
        return {
            "message": "Usuario registrado exitosamente",
            "user_id": user_id
        }
    
    except Exception as e:
        logger.error(f"Error al registrar usuario: {e}")
        return {"error": "Error interno del servidor"}

def authenticate_user(email: str, password: str, ip_address: Optional[str] = None) -> Optional[Dict[str, str]]:
    """Autenticación de usuario"""
    try:
        email = email.lower().strip()
        user = get_user_by_email(email)
        
        if not user:
            _log_audit(None, "login_failed", f"Intento de login con email inexistente: {email}", ip_address)
            return None
        
        user_id = str(user["_id"])
        
        # Verificar si el usuario está bloqueado
        if user.get("locked_until") and user["locked_until"] > datetime.now(timezone.utc):
            _log_audit(user_id, "login_blocked", "Intento de login con cuenta bloqueada", ip_address)
            return None
            
        # Verificar si el usuario está activo
        if not user.get("is_active", True):
            _log_audit(user_id, "login_inactive", "Intento de login con cuenta inactiva", ip_address)
            return None
        
        # Verificar contraseña
        if not verify_password(password, user["password_hash"]):
            # Incrementar intentos fallidos
            failed_attempts = user.get("failed_login_attempts", 0) + 1
            update_data = {"failed_login_attempts": failed_attempts}
            
            # Bloquear cuenta si hay muchos intentos fallidos
            if failed_attempts >= 5:
                update_data["locked_until"] = datetime.now(timezone.utc) + timedelta(minutes=30)
                
            users_collection.update_one(
                {"_id": user["_id"]},
                {"$set": update_data}
            )
            
            _log_audit(user_id, "login_failed", f"Contraseña incorrecta (intento {failed_attempts})", ip_address)
            return None

        # Obtener información del rol
        role = roles_collection.find_one({"_id": user["role_id"]})
        role_name = role["name"] if role else "usuario"

        # Login exitoso - limpiar intentos fallidos y actualizar último login
        users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "last_login": datetime.now(timezone.utc),
                    "failed_login_attempts": 0
                },
                "$unset": {"locked_until": ""}
            }
        )

        # Crear tokens
        access_token = create_access_token(user_id, role_name)
        refresh_token = create_refresh_token(user_id)
        
        _log_audit(user_id, "login", "Login exitoso", ip_address)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": get_access_token_expire_seconds()
        }
    
    except Exception as e:
        logger.error(f"Error al autenticar usuario: {e}")
        return None

def refresh_access_token(refresh_token: str, ip_address: Optional[str] = None) -> Optional[Dict[str, str]]:
    """Renovación de token de acceso"""
    try:
        user_id = verify_refresh_token(refresh_token)
        if not user_id:
            return None

        user = get_user_by_id(user_id)
        if not user or not user.get("is_active", True):
            return None

        # Obtener rol
        role = roles_collection.find_one({"_id": user["role_id"]})
        role_name = role["name"] if role else "usuario"

        # Crear nuevo access token
        access_token = create_access_token(user_id, role_name)
        
        _log_audit(user_id, "token_refresh", "Token refrescado", ip_address)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": get_access_token_expire_seconds()
        }
    
    except Exception as e:
        logger.error(f"Error al refrescar token: {e}")
        return None

def get_current_user(user_id: str) -> Optional[UserOut]:
    """Obtener usuario actual para respuestas"""
    try:
        user = get_user_by_id(user_id)
        if not user:
            return None
            
        role = roles_collection.find_one({"_id": user["role_id"]})
        role_name = role["name"] if role else "usuario"
        
        return UserOut(
            id=str(user["_id"]),
            email=user["email"],
            role_name=role_name,
            is_active=user.get("is_active", True),
            created_at=user.get("created_at", datetime.now(timezone.utc)),
            last_login=user.get("last_login")
        )
    
    except Exception as e:
        logger.error(f"Error al obtener usuario actual: {e}")
        return None

def change_password(user_id: str, current_password: str, new_password: str, ip_address: Optional[str] = None) -> bool:
    """Cambiar contraseña de usuario"""
    try:
        user = get_user_by_id(user_id)
        if not user:
            return False
            
        # Verificar contraseña actual
        if not verify_password(current_password, user["password_hash"]):
            _log_audit(user_id, "password_change_failed", "Contraseña actual incorrecta", ip_address)
            return False
            
        # Actualizar contraseña
        new_hash = hash_password(new_password)
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password_hash": new_hash}}
        )
        
        _log_audit(user_id, "password_change", "Contraseña cambiada exitosamente", ip_address)
        return True
        
    except Exception as e:
        logger.error(f"Error al cambiar contraseña: {e}")
        return False

def request_password_reset(email: str, ip_address: Optional[str] = None) -> Optional[str]:
    """Solicitar reset de contraseña"""
    try:
        user = get_user_by_email(email)
        if not user:
            return None  # No revelar si el email existe o no
            
        user_id = str(user["_id"])
        reset_token = create_password_reset_token(user_id)
        
        _log_audit(user_id, "password_reset_request", "Solicitud de reset de contraseña", ip_address)
        
        # En producción, aquí enviarías un email con el token
        return reset_token
        
    except Exception as e:
        logger.error(f"Error al solicitar reset de contraseña: {e}")
        return None

def reset_password(token: str, new_password: str, ip_address: Optional[str] = None) -> bool:
    """Resetear contraseña con token"""
    try:
        user_id = verify_password_reset_token(token)
        if not user_id:
            return False
            
        user = get_user_by_id(user_id)
        if not user:
            return False
            
        # Actualizar contraseña
        new_hash = hash_password(new_password)
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "password_hash": new_hash,
                    "failed_login_attempts": 0
                },
                "$unset": {"locked_until": ""}
            }
        )
        
        _log_audit(user_id, "password_reset", "Contraseña reseteada exitosamente", ip_address)
        return True
        
    except Exception as e:
        logger.error(f"Error al resetear contraseña: {e}")
        return False

def get_all_users() -> List[UserOut]:
    """Obtener todos los usuarios (solo para admins)"""
    try:
        users = list(users_collection.find({}))
        result = []
        
        for user in users:
            role = roles_collection.find_one({"_id": user["role_id"]})
            role_name = role["name"] if role else "usuario"
            
            result.append(UserOut(
                id=str(user["_id"]),
                email=user["email"],
                role_name=role_name,
                is_active=user.get("is_active", True),
                created_at=user.get("created_at", datetime.now(timezone.utc)),
                last_login=user.get("last_login")
            ))
            
        return result
        
    except Exception as e:
        logger.error(f"Error al obtener usuarios: {e}")
        return []