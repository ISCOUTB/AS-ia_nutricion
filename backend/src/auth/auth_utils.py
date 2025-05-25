from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import os
import secrets
from typing import Optional, Dict, Any
import logging
import jwt

# Verificar que el módulo jwt es PyJWT
try:
    import jwt
    # Verificar que es PyJWT y no otro paquete jwt
    if not hasattr(jwt, 'encode') or not hasattr(jwt, 'decode'):
        raise ImportError("El módulo jwt importado no es PyJWT")
    
    # Verificar versión si es necesario
    if hasattr(jwt, '__version__'):
        print(f"Using PyJWT version: {jwt.__version__}")
    
except ImportError as e:
    print(f"Error importing PyJWT: {e}")
    # Intentar import alternativo si tienes problemas
    try:
        from jwt import PyJWT
        jwt = PyJWT()
    except ImportError:
        raise ImportError("No se pudo importar PyJWT. Instala con: pip install PyJWT")


logger = logging.getLogger(__name__)

# Configuración segura desde variables de entorno
SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY")  # Corregido el nombre
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Generar claves por defecto si no están definidas (solo para desarrollo)
if not SECRET_KEY:
    SECRET_KEY = secrets.token_urlsafe(32)
    logger.warning("SECRET_KEY no definida, generando una temporal para desarrollo")

if not REFRESH_SECRET_KEY:
    REFRESH_SECRET_KEY = secrets.token_urlsafe(32)
    logger.warning("REFRESH_SECRET_KEY no definida, generando una temporal para desarrollo")

# Contexto de hashing con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funciones de hashing y verificación
def hash_password(password: str) -> str:
    """Hash de contraseña usando bcrypt"""
    try:
        return pwd_context.hash(password)
    except Exception as e:
        logger.error(f"Error al hacer hash de contraseña: {e}")
        raise ValueError("Error al procesar la contraseña")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña contra hash"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Error al verificar contraseña: {e}")
        return False

# Crear un JWT con expiración
def create_jwt(data: Dict[str, Any], expires_delta: timedelta, secret_key: str) -> str:
    """Crear JWT con datos y tiempo de expiración"""
    try:
        # DEBUG: Información detallada del módulo jwt
        print(f"DEBUG - JWT Module: {jwt}")
        print(f"DEBUG - JWT Name: {getattr(jwt, '__name__', 'N/A')}")
        print(f"DEBUG - JWT File: {getattr(jwt, '__file__', 'N/A')}")
        print(f"DEBUG - JWT Version: {getattr(jwt, '__version__', 'N/A')}")
        print(f"DEBUG - JWT Dir: {dir(jwt)}")
        print(f"DEBUG - Has encode: {hasattr(jwt, 'encode')}")
        
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({
            "exp": expire.timestamp(),
            "iat": datetime.now(timezone.utc).timestamp()
        })
        
        # Verificar que tenemos el método encode
        if not hasattr(jwt, 'encode'):
            raise AttributeError("JWT library no tiene método encode")
            
        encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)
        
        # PyJWT v2.0+ devuelve string, versiones anteriores bytes
        if isinstance(encoded_jwt, bytes):
            encoded_jwt = encoded_jwt.decode('utf-8')
            
        return encoded_jwt
        
    except Exception as e:
        logger.error(f"Error al crear JWT: {e}")
        logger.error(f"JWT module: {jwt.__name__ if hasattr(jwt, '__name__') else 'unknown'}")
        logger.error(f"JWT version: {getattr(jwt, '__version__', 'unknown')}")
        raise ValueError(f"Error al crear token: {str(e)}")

# Decodificar un JWT
def decode_jwt(token: str, secret_key: str) -> Optional[Dict[str, Any]]:
    """Decodificar JWT y validar"""
    try:
        # Verificar que tenemos el método decode
        if not hasattr(jwt, 'decode'):
            raise AttributeError("JWT library no tiene método decode")
            
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        
        # Convertir timestamps de vuelta a datetime si es necesario
        if 'exp' in payload and isinstance(payload['exp'], (int, float)):
            payload['exp'] = datetime.fromtimestamp(payload['exp'], tz=timezone.utc)
        if 'iat' in payload and isinstance(payload['iat'], (int, float)):
            payload['iat'] = datetime.fromtimestamp(payload['iat'], tz=timezone.utc)
            
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("Token expirado")
        return None
    except jwt.InvalidTokenError:
        logger.warning("Token inválido")
        return None
    except Exception as e:
        logger.error(f"Error al decodificar JWT: {e}")
        return None

# Crear access token con duración corta
def create_access_token(user_id: str, role: str = None) -> str:
    """Crear token de acceso"""
    data = {"sub": user_id, "type": "access"}
    if role:
        data["role"] = role
    return create_jwt(
        data,
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        SECRET_KEY
    )

# Crear refresh token con duración larga
def create_refresh_token(user_id: str) -> str:
    """Crear token de refresco"""
    return create_jwt(
        {"sub": user_id, "type": "refresh"},
        timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        REFRESH_SECRET_KEY
    )

# Verificar access token y extraer datos
def verify_access_token(access_token: str) -> Optional[Dict[str, Any]]:
    """Verificar token de acceso y extraer payload"""
    payload = decode_jwt(access_token, SECRET_KEY)
    if not payload or payload.get("type") != "access":
        return None
    return payload

# Verificar refresh token y extraer user_id
def verify_refresh_token(refresh_token: str) -> Optional[str]:
    """Verificar token de refresco y extraer user_id"""
    payload = decode_jwt(refresh_token, REFRESH_SECRET_KEY)
    if not payload or payload.get("type") != "refresh":
        return None
    return payload.get("sub")

# Crear token para reset de contraseña
def create_password_reset_token(user_id: str) -> str:
    """Crear token para reset de contraseña (válido por 1 hora)"""
    return create_jwt(
        {"sub": user_id, "type": "password_reset"},
        timedelta(hours=1),
        SECRET_KEY
    )

# Verificar token de reset de contraseña
def verify_password_reset_token(token: str) -> Optional[str]:
    """Verificar token de reset de contraseña"""
    payload = decode_jwt(token, SECRET_KEY)
    if not payload or payload.get("type") != "password_reset":
        return None
    return payload.get("sub")

# Obtener tiempo de expiración en segundos
def get_access_token_expire_seconds() -> int:
    """Obtener tiempo de expiración del access token en segundos"""
    return ACCESS_TOKEN_EXPIRE_MINUTES * 60