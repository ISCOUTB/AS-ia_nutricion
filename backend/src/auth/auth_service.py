from db.database import db
from db.models.user import User
from .auth_utils import hash_password, verify_password, create_access_token, create_refresh_token, verify_refresh_token
from bson import ObjectId
from datetime import datetime, timezone

usuarios_collection = db["usuarios"]

def register_user(email: str, password: str):
    # Verifica si ya existe un usuario con ese email
    if usuarios_collection.find_one({"email": email}):
        return None  # Usuario ya existe

    try:
        user_data = User(
            email=email,
            password_hash=hash_password(password),
            created_at=datetime.now(timezone.utc),
            is_active=True,
            role_id=None  # O ObjectId(...) si tienes un rol por defecto
        )
        result = usuarios_collection.insert_one(user_data.dict(by_alias=True, exclude={"id"}))
        return {"message": "Usuario registrado", "user_id": str(result.inserted_id)}
    except Exception as e:
        print(f"Error al registrar usuario: {e}")
        return None

def authenticate_user(email: str, password: str):
    user = usuarios_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        return None  # Credenciales incorrectas

    user_id = str(user["_id"])

    return {
        "access_token": create_access_token(user_id),
        "refresh_token": create_refresh_token(user_id),
        "token_type": "bearer"
    }

def refresh_access_token(refresh_token: str):
    user_id = verify_refresh_token(refresh_token)
    if not user_id:
        return None  # Refresh token inválido

    return {
        "access_token": create_access_token(user_id),
        "token_type": "bearer"
    }
