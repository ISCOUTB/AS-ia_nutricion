from .auth_utils import hash_password, verify_password, create_access_token, create_refresh_token, verify_refresh_token

# Simulación de base de datos de usuarios
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
    return {
        "access_token": create_access_token(email),
        "refresh_token": create_refresh_token(email),
        "token_type": "bearer"
    }

def refresh_access_token(refresh_token: str):
    email = verify_refresh_token(refresh_token)
    if not email:
        return None  # Refresh token inválido
    return {
        "access_token": create_access_token(email),
        "token_type": "bearer"
    }
