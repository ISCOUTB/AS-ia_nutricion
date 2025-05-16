from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from src.auth.auth_routes import auth_router
from src.children.child_routes import child_router
from src.measurements.measurement_routes import measurement_router
from src.reports.report_routes import report_router

app = FastAPI(    title="Nutrikids API",
    description="API para autenticación y manejo de usuarios",
    version="1.0.0"
)
app.include_router(auth_router, prefix="/auth", tags=["Autenticación"])
app.include_router(child_router, prefix="/children", tags=["Niños"])
app.include_router(measurement_router, prefix="/measurements", tags=["Mediciones"])
app.include_router(report_router, prefix="/reports", tags=["Reportes"])


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
