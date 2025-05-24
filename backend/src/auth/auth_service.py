from db.database import db
from db.models.user import UserInDB
from .auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token
)
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, Dict

# Conexión a la colección usuarios
usuarios_collection = db["usuarios"]

# Registro de usuario
def register_user(email: str, password: str) -> Optional[Dict[str, str]]:
    # Verifica si ya existe un usuario con ese email
    if usuarios_collection.find_one({"email": email}):
        return None  # Usuario ya existe

    try:
        user_data = UserInDB(
            email=email,
            password_hash=hash_password(password),
            created_at=datetime.now(timezone.utc),
            is_active=True,
            role_id=None  # Puedes poner aquí ObjectId("...") si tienes un rol por defecto
        )

        result = usuarios_collection.insert_one(user_data.model_dump(by_alias=True, exclude={"id"}))
        return {"message": "Usuario registrado", "user_id": str(result.inserted_id)}
    
    except Exception as e:
        print(f"Error al registrar usuario: {e}")
        return None

# Autenticación de usuario
def authenticate_user(email: str, password: str) -> Optional[Dict[str, str]]:
    try:
        user = usuarios_collection.find_one({"email": email})
        if not user:
            return None
        
        if not verify_password(password, user["password_hash"]):
            return None  # Contraseña incorrecta

        user_id = str(user["_id"])
        return {
            "access_token": create_access_token(user_id),
            "refresh_token": create_refresh_token(user_id),
            "token_type": "bearer"
        }
    
    except Exception as e:
        print(f"Error al autenticar usuario: {e}")
        return None

# Renovación de token de acceso
def refresh_access_token(refresh_token: str) -> Optional[Dict[str, str]]:
    user_id = verify_refresh_token(refresh_token)
    if not user_id:
        return None  # Token inválido o expirado

    return {
        "access_token": create_access_token(user_id),
        "token_type": "bearer"
    }
