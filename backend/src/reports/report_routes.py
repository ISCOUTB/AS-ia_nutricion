from fastapi import APIRouter, HTTPException, status
from typing import List
from report_models import ReporteIndividual, ReporteGrupal
from report_service import generar_reporte_individual, generar_reporte_grupal

report_router = APIRouter(prefix="/reports", tags=["Reportes"])

# Reporte individual por niño
@report_router.get("/individual/{child_id}", response_model=ReporteIndividual)
def reporte_individual(child_id: str):
    try:
        reporte = generar_reporte_individual(child_id)
        return reporte
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Reporte grupal general
@report_router.get("/group", response_model=ReporteGrupal)
def reporte_grupal():
    reporte = generar_reporte_grupal()
    return reporte
