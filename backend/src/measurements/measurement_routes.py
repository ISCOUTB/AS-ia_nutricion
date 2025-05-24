from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from pydantic import ValidationError
from .measurement_models import Measurement, MeasurementCreate
from .measurement_service import (
    create_measurement,
    get_all_measurements,
    get_measurements_by_child,
    get_measurement_by_id,
    update_measurement,
    delete_measurement,
    get_latest_measurement_by_child
)
import logging

logger = logging.getLogger(__name__)

measurement_router = APIRouter(prefix="/measurements", tags=["Mediciones"])

# Crear una medición
@measurement_router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create(measurement: MeasurementCreate):
    """Crear una nueva medición antropométrica"""
    try:
        measurement_id = create_measurement(measurement)
        return {
            "message": "Medición registrada exitosamente",
            "measurement_id": measurement_id
        }
    except ValidationError as e:
        logger.error(f"Error de validación creando medición: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error de validación: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Error de valor creando medición: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error interno creando medición: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Obtener todas las mediciones con paginación opcional
@measurement_router.get("/", response_model=List[Measurement])
def read_all(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros")
):
    """Obtener todas las mediciones con paginación opcional"""
    try:
        measurements = get_all_measurements()
        # Aplicar paginación manual (idealmente esto debería hacerse en la base de datos)
        return measurements[skip:skip + limit]
    except Exception as e:
        logger.error(f"Error obteniendo todas las mediciones: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Obtener una medición por ID
@measurement_router.get("/{measurement_id}", response_model=Measurement)
def read_one(measurement_id: str):
    """Obtener una medición específica por su ID"""
    try:
        result = get_measurement_by_id(measurement_id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medición no encontrada"
            )
        return result
    except ValueError as e:
        logger.error(f"Error de validación obteniendo medición {measurement_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error interno obteniendo medición {measurement_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Obtener todas las mediciones de un niño
@measurement_router.get("/child/{child_id}", response_model=List[Measurement])
def read_by_child(
    child_id: str,
    latest_only: bool = Query(False, description="Retornar solo la medición más reciente")
):
    """Obtener todas las mediciones de un niño específico"""
    try:
        if latest_only:
            result = get_latest_measurement_by_child(child_id)
            return [result] if result else []
        else:
            return get_measurements_by_child(child_id)
    except ValueError as e:
        logger.error(f"Error de validación obteniendo mediciones del niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error interno obteniendo mediciones del niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Actualizar una medición
@measurement_router.put("/{measurement_id}", response_model=dict)
def update(measurement_id: str, updated_data: dict):
    """Actualizar una medición existente"""
    try:
        # Validar que los datos enviados sean válidos
        allowed_fields = {"peso", "talla", "fecha_medicion", "child_id"}
        invalid_fields = set(updated_data.keys()) - allowed_fields
        
        if invalid_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Campos no permitidos: {', '.join(invalid_fields)}"
            )
        
        if not updated_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se proporcionaron datos para actualizar"
            )
        
        success = update_measurement(measurement_id, updated_data)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medición no encontrada o no se pudo actualizar"
            )
        
        return {"message": "Medición actualizada exitosamente"}
        
    except ValueError as e:
        logger.error(f"Error de validación actualizando medición {measurement_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error interno actualizando medición {measurement_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Eliminar una medición
@measurement_router.delete("/{measurement_id}", response_model=dict)
def delete(measurement_id: str):
    """Eliminar una medición"""
    try:
        success = delete_measurement(measurement_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medición no encontrada o no se pudo eliminar"
            )
        
        return {"message": "Medición eliminada exitosamente"}
        
    except ValueError as e:
        logger.error(f"Error de validación eliminando medición {measurement_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error interno eliminando medición {measurement_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Endpoint adicional: Obtener estadísticas básicas de un niño
def _calculate_stats(measurements):
    pesos = [m.peso for m in measurements]
    tallas = [m.talla for m in measurements]
    imcs = [m.imc for m in measurements if m.imc is not None]

    def get_stat(values):
        if not values:
            return {"actual": None, "minimo": None, "maximo": None, "promedio": None}
        return {
            "actual": values[-1],
            "minimo": min(values),
            "maximo": max(values),
            "promedio": round(sum(values) / len(values), 2)
        }

    return {
        "total_mediciones": len(measurements),
        "peso": get_stat(pesos),
        "talla": get_stat(tallas),
        "imc": get_stat(imcs),
        "primera_medicion": measurements[0].fecha_medicion if measurements else None,
        "ultima_medicion": measurements[-1].fecha_medicion if measurements else None
    }

@measurement_router.get("/child/{child_id}/stats", response_model=dict)
def get_child_stats(child_id: str):
    """Obtener estadísticas básicas de las mediciones de un niño"""
    try:
        measurements = get_measurements_by_child(child_id)
        if not measurements:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron mediciones para este niño"
            )
        stats = _calculate_stats(measurements)
        return stats
    except ValueError as e:
        logger.error(f"Error de validación obteniendo estadísticas del niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error interno obteniendo estadísticas del niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )