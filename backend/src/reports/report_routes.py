from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import Optional
from .report_models import ReporteIndividual, ReporteGrupal, ReporteSeguimiento, ReportFilter
from .report_service import generar_reporte_individual, generar_reporte_grupal, generar_reporte_seguimiento
import logging

logger = logging.getLogger(__name__)

report_router = APIRouter(prefix="/reports", tags=["Reportes"])


@report_router.get("/individual/{child_id}", response_model=ReporteIndividual)
async def obtener_reporte_individual(child_id: str):
    """
    Obtiene un reporte individual completo para un niño específico.
    Incluye todas las mediciones, clasificaciones y tendencias.
    """
    try:
        reporte = generar_reporte_individual(child_id)
        return reporte
    except ValueError as e:
        logger.warning(f"Niño no encontrado: {child_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generando reporte individual: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al generar el reporte"
        )


@report_router.get("/group", response_model=ReporteGrupal)
async def obtener_reporte_grupal(
    sexo: Optional[str] = Query(None, description="Filtrar por sexo (M o F)"),
    edad_min: Optional[int] = Query(None, description="Edad mínima en años"),
    edad_max: Optional[int] = Query(None, description="Edad máxima en años"),
    institucion: Optional[str] = Query(None, description="Filtrar por institución"),
    barrio: Optional[str] = Query(None, description="Filtrar por barrio")
):
    """
    Obtiene un reporte grupal con estadísticas generales.
    Permite filtrar por diferentes criterios.
    """
    try:
        # Crear filtros si se proporcionaron
        filtros = None
        if any([sexo, edad_min, edad_max, institucion, barrio]):
            filtros = ReportFilter(
                sexo=sexo,
                rango_edad_min=edad_min,
                rango_edad_max=edad_max,
                institucion=institucion,
                barrio=barrio
            )
        
        reporte = generar_reporte_grupal(filtros)
        return reporte
    except ValueError as e:
        logger.warning(f"Error en parámetros de filtro: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generando reporte grupal: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al generar el reporte"
        )


@report_router.get("/seguimiento/{child_id}", response_model=ReporteSeguimiento)
async def obtener_reporte_seguimiento(child_id: str):
    """
    Obtiene un reporte de seguimiento para un niño específico.
    Muestra la evolución de las mediciones a lo largo del tiempo.
    """
    try:
        reporte = generar_reporte_seguimiento(child_id)
        return reporte
    except ValueError as e:
        logger.warning(f"Niño no encontrado para seguimiento: {child_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generando reporte de seguimiento: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al generar el reporte"
        )


@report_router.get("/health")
async def health_check():
    """Endpoint simple para verificar que el servicio de reportes está funcionando"""
    return {"status": "healthy", "service": "reports"}


# Endpoint adicional para obtener estadísticas rápidas
@report_router.get("/stats/quick")
async def obtener_estadisticas_rapidas():
    """
    Obtiene estadísticas rápidas del sistema sin filtros.
    Útil para dashboards.
    """
    try:
        from db.database import db
        
        # Estadísticas básicas
        total_ninos = db.children.count_documents({})
        total_mediciones = db.anthropometric_data.count_documents({})
        total_clasificaciones = db.classification_results.count_documents({})
        
        # Última actividad
        ultima_medicion = db.anthropometric_data.find_one(
            {}, sort=[("fecha_medicion", -1)]
        )
        ultima_clasificacion = db.classification_results.find_one(
            {}, sort=[("fecha_resultado", -1)]
        )
        
        return {
            "total_ninos": total_ninos,
            "total_mediciones": total_mediciones,
            "total_clasificaciones": total_clasificaciones,
            "ultima_medicion": ultima_medicion["fecha_medicion"] if ultima_medicion else None,
            "ultima_clasificacion": ultima_clasificacion["fecha_resultado"] if ultima_clasificacion else None
        }
    except Exception as e:
        logger.error(f"Error obteniendo estadísticas rápidas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo estadísticas"
        )