from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRETKEY")  # Clave separada para refresh tokens
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Expira rápido
REFRESH_TOKEN_EXPIRE_DAYS = 7  # Dura más tiempo

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Base de datos en memoria para refresh tokens (simulación)
refresh_tokens_db = {}

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt(data: dict, expires_delta: timedelta, secret_key: str):
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)

def decode_jwt(token: str, secret_key: str):
    try:
        return jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def create_access_token(email: str):
    return create_jwt({"sub": email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES), SECRET_KEY)

def create_refresh_token(email: str):
    refresh_token = create_jwt({"sub": email}, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS), REFRESH_SECRET_KEY)
    refresh_tokens_db[email] = refresh_token  # Guardamos el refresh token
    return refresh_token

def verify_refresh_token(refresh_token: str):
    payload = decode_jwt(refresh_token, REFRESH_SECRET_KEY)
    if not payload:
        return None
    email = payload["sub"]
    stored_refresh_token = refresh_tokens_db.get(email)
    if stored_refresh_token != refresh_token:
        return None  # Token inválido o no registrado
    return email
