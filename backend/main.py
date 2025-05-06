from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from src.auth.auth_routes import auth_router


app = FastAPI()
app.include_router(auth_router)

origins = [
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
