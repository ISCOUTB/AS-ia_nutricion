from db.database import db
from db.models.user import User
from .auth_utils import hash_password, verify_password, create_access_token, create_refresh_token, verify_refresh_token
from bson import ObjectId
from datetime import datetime

usuarios_collection = db["usuarios"]

def register_user(email: str, password: str):
    # Verifica si ya existe un usuario con ese email
    if usuarios_collection.find_one({"email": email}):
        return None  # Usuario ya existe

    user = {
        "email": email,
        "password_hash": hash_password(password),
        "created_at": datetime.now(),
        "is_active": True,
        # Puedes asignar un rol por defecto (ej: 'nutricionista') si lo deseas
        "role_id": None  # Si luego quieres relacionarlo
    }

    result = usuarios_collection.insert_one(user)
    return {"message": "Usuario registrado", "user_id": str(result.inserted_id)}

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
