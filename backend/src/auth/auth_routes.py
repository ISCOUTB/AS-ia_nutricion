from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth_service import register_user, authenticate_user, refresh_access_token
from .auth_models import UserCreate

auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@auth_router.post("/register")
async def register(user: UserCreate):
    result = register_user(user.email, user.password)
    if result is None:
        raise HTTPException(status_code=400, detail="User already exists")
    return result

@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    tokens = authenticate_user(form_data.username, form_data.password)
    if tokens is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return tokens  # Devuelve access y refresh token

@auth_router.post("/refresh")
async def refresh_token(refresh_token: str):
    new_access_token = refresh_access_token(refresh_token)
    if new_access_token is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return new_access_token

@auth_router.get("/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    from .auth_utils import decode_jwt
    payload = decode_jwt(token, "your_secret_key")
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"email": payload["sub"]}
