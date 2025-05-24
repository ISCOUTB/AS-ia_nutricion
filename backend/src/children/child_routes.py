from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
from .child_models import ChildCreate, ChildUpdate, ChildInResponse, ChildSummary
from .child_service import (
    create_child,
    get_all_children,
    get_child_by_id,
    update_child,
    delete_child,
    search_children
)
import logging

logger = logging.getLogger(__name__)

child_router = APIRouter(
    prefix="/children",
    tags=["Gestión de Niños"]
)

# === Crear niño ===
@child_router.post("/", status_code=status.HTTP_201_CREATED)
def create_new_child(child: ChildCreate):
    """
    Crea un nuevo registro de niño.
    
    - **child**: Datos del niño a crear
    
    Retorna el ID del niño creado y un mensaje de confirmación.
    """
    try:
        child_id = create_child(child)
        return {
            "message": "Niño registrado exitosamente",
            "child_id": child_id,
            "status": "success"
        }
    except ValueError as e:
        logger.warning(f"Error de validación al crear niño: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error interno al crear niño: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear el niño"
        )

# === Obtener todos los niños (resumen) ===
@child_router.get("/", response_model=List[ChildSummary])
def get_children_list():
    """
    Obtiene la lista de todos los niños registrados (información resumida).
    
    Retorna una lista con información básica de cada niño.
    """
    try:
        return get_all_children()
    except Exception as e:
        logger.error(f"Error obteniendo lista de niños: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener la lista de niños"
        )

# === Buscar niños por criterios ===
@child_router.get("/search", response_model=List[ChildSummary])
def search_children_by_criteria(
    nombre: Optional[str] = Query(None, description="Buscar por nombre (búsqueda parcial)"),
    apellido: Optional[str] = Query(None, description="Buscar por apellido (búsqueda parcial)"),
    documento: Optional[str] = Query(None, description="Buscar por número de documento (búsqueda exacta)"),
    institucion: Optional[str] = Query(None, description="Buscar por institución"),
    sexo: Optional[str] = Query(None, description="Buscar por sexo (M/F)")
):
    """
    Busca niños por diferentes criterios.
    
    - **nombre**: Búsqueda parcial por nombre
    - **apellido**: Búsqueda parcial por apellido  
    - **documento**: Búsqueda exacta por número de documento
    - **institucion**: Búsqueda por institución
    - **sexo**: Búsqueda por sexo (M/F)
    
    Al menos uno de los criterios debe ser proporcionado.
    """
    # Validar que al menos un criterio sea proporcionado
    criteria_provided = any([nombre, apellido, documento, institucion, sexo])
    if not criteria_provided:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe proporcionar al menos un criterio de búsqueda"
        )
    
    try:
        return search_children(
            nombre=nombre,
            apellido=apellido,
            documento=documento,
            institucion=institucion,
            sexo=sexo
        )
    except Exception as e:
        logger.error(f"Error en búsqueda de niños: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al buscar niños"
        )

# === Obtener un niño por ID ===
@child_router.get("/{child_id}", response_model=ChildInResponse)
def get_child_details(child_id: str):
    """
    Obtiene los detalles completos de un niño específico.
    
    - **child_id**: ID del niño a consultar
    
    Retorna toda la información disponible del niño.
    """
    try:
        child = get_child_by_id(child_id)
        if not child:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró ningún niño con ID: {child_id}"
            )
        return child
    except HTTPException:
        # Re-raise HTTPException para mantener el status code
        raise
    except Exception as e:
        logger.error(f"Error obteniendo niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener el niño"
        )

# === Actualizar un niño por ID ===
@child_router.put("/{child_id}")
def update_child_data(child_id: str, updated_data: ChildUpdate):
    """
    Actualiza los datos de un niño existente.
    
    - **child_id**: ID del niño a actualizar
    - **updated_data**: Datos a actualizar (solo se envían los campos que cambian)
    
    Retorna un mensaje de confirmación.
    """
    # Validar que se proporcionaron campos para actualizar
    update_fields = updated_data.model_dump(exclude_unset=True, exclude_none=True)
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron campos para actualizar"
        )

    try:
        success = update_child(child_id, updated_data)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró ningún niño con ID: {child_id}"
            )
        
        return {
            "message": "Niño actualizado exitosamente",
            "child_id": child_id,
            "updated_fields": list(update_fields.keys()),
            "status": "success"
        }
        
    except ValueError as e:
        logger.warning(f"Error de validación al actualizar niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        # Re-raise HTTPException para mantener el status code
        raise
    except Exception as e:
        logger.error(f"Error interno al actualizar niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al actualizar el niño"
        )

# === Eliminar un niño por ID ===
@child_router.delete("/{child_id}")
def delete_child_record(child_id: str):
    """
    Elimina un niño y todos sus datos relacionados.
    
    - **child_id**: ID del niño a eliminar
    
    **ADVERTENCIA**: Esta operación elimina permanentemente:
    - Los datos básicos del niño
    - Datos antropométricos
    - Datos conductuales
    - Historial médico
    - Resultados de clasificación
    
    Esta acción no se puede deshacer.
    """
    try:
        success = delete_child(child_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró ningún niño con ID: {child_id}"
            )
        
        return {
            "message": "Niño y todos sus datos relacionados eliminados exitosamente",
            "child_id": child_id,
            "status": "success"
        }
        
    except HTTPException:
        # Re-raise HTTPException para mantener el status code
        raise
    except Exception as e:
        logger.error(f"Error interno al eliminar niño {child_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al eliminar el niño"
        )

# === Health check específico para el servicio de niños ===
@child_router.get("/health/check")
def children_health_check():
    """
    Verifica el estado del servicio de gestión de niños.
    
    Retorna información sobre la disponibilidad del servicio y estadísticas básicas.
    """
    try:
        # Intentar contar los niños para verificar conectividad con DB
        children = get_all_children()
        total_children = len(children)
        
        return {
            "service": "children",
            "status": "healthy",
            "total_children": total_children,
            "timestamp": "2024-01-20T00:00:00Z"  # En producción, usar datetime.now()
        }
        
    except Exception as e:
        logger.error(f"Health check falló: {e}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "service": "children",
                "status": "unhealthy",
                "error": "Database connection failed",
                "timestamp": "2024-01-20T00:00:00Z"
            }
        )