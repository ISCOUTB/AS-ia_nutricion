from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth_service import register_user, authenticate_user
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
    token = authenticate_user(form_data.username, form_data.password)
    if token is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    from .auth_utils import decode_jwt
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"email": payload["sub"]}
