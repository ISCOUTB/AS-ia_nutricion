from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth_service import register_user, authenticate_user, refresh_access_token
from .auth_models import UserCreate, Token
from db.database import db
from db.models.user import User
from .auth_utils import decode_jwt
import os
from bson import ObjectId

auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
usuarios_collection = db["usuarios"]
SECRET_KEY = os.getenv("SECRET_KEY")

@auth_router.post("/register", response_model=dict)
async def register(user: UserCreate):
    result = register_user(user.email, user.password)
    if result is None:
        raise HTTPException(status_code=400, detail="User already exists")
    return result

@auth_router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    tokens = authenticate_user(form_data.username, form_data.password)
    if tokens is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return tokens  # access_token, refresh_token, token_type

@auth_router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str = Body(..., embed=True)):
    new_access_token = refresh_access_token(refresh_token)
    if new_access_token is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return new_access_token

@auth_router.get("/me", response_model=User)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    payload = decode_jwt(token, SECRET_KEY)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user_data = usuarios_collection.find_one({"_id": ObjectId(user_id)})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return User(**user_data)
