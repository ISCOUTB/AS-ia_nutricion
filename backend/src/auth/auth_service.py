from .auth_utils import hash_password, verify_password, create_jwt
from datetime import timedelta

# Simulación de base de datos en memoria
fake_db = {}

def register_user(email: str, password: str):
    if email in fake_db:
        return None  # Usuario ya existe
    hashed_password = hash_password(password)
    fake_db[email] = hashed_password
    return {"message": "User registered"}

def authenticate_user(email: str, password: str):
    hashed_password = fake_db.get(email)
    if not hashed_password or not verify_password(password, hashed_password):
        return None  # Credenciales incorrectas
    return create_jwt({"sub": email}, timedelta(minutes=60))
