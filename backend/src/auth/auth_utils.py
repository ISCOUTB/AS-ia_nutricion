from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
import os
from typing import Optional, Dict, Any

# Configuración segura desde variables de entorno
SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRETKEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Validar que existan las claves necesarias
if not SECRET_KEY or not REFRESH_SECRET_KEY:
    raise ValueError("SECRET_KEY y REFRESH_SECRETKEY deben estar definidas en el entorno.")

# Contexto de hashing con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funciones de hashing y verificación
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Crear un JWT con expiración
def create_jwt(data: Dict[str, Any], expires_delta: timedelta, secret_key: str) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)

# Decodificar un JWT
def decode_jwt(token: str, secret_key: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None

# Crear access token con duración corta
def create_access_token(user_id: str) -> str:
    return create_jwt(
        {"sub": user_id},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        SECRET_KEY
    )

# Crear refresh token con duración larga
def create_refresh_token(user_id: str) -> str:
    return create_jwt(
        {"sub": user_id},
        timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        REFRESH_SECRET_KEY
    )

# Verificar refresh token y extraer user_id
def verify_refresh_token(refresh_token: str) -> Optional[str]:
    payload = decode_jwt(refresh_token, REFRESH_SECRET_KEY)
    if not payload:
        return None
    return payload.get("sub")
