from fastapi import APIRouter, HTTPException, status
from typing import List
from measurement_models import Measurement
from measurement_service import (
    create_measurement,
    get_all_measurements,
    get_measurements_by_child,
    get_measurement_by_id,
    update_measurement,
    delete_measurement
)

measurement_router = APIRouter(prefix="/measurements", tags=["Mediciones"])

# Crear una medición
@measurement_router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create(measurement: Measurement):
    measurement_id = create_measurement(measurement)
    return {"message": "Medición registrada", "measurement_id": measurement_id}

# Obtener todas las mediciones
@measurement_router.get("/", response_model=List[Measurement])
def read_all():
    return get_all_measurements()

# Obtener una medición por ID
@measurement_router.get("/{measurement_id}", response_model=Measurement)
def read_one(measurement_id: str):
    result = get_measurement_by_id(measurement_id)
    if not result:
        raise HTTPException(status_code=404, detail="Medición no encontrada")
    return result

# Obtener todas las mediciones de un niño
@measurement_router.get("/child/{child_id}", response_model=List[Measurement])
def read_by_child(child_id: str):
    return get_measurements_by_child(child_id)

# Actualizar una medición
@measurement_router.put("/{measurement_id}", response_model=dict)
def update(measurement_id: str, updated_data: dict):
    success = update_measurement(measurement_id, updated_data)
    if not success:
        raise HTTPException(status_code=404, detail="No se pudo actualizar")
    return {"message": "Medición actualizada"}

# Eliminar una medición
@measurement_router.delete("/{measurement_id}", response_model=dict)
def delete(measurement_id: str):
    success = delete_measurement(measurement_id)
    if not success:
        raise HTTPException(status_code=404, detail="No se pudo eliminar")
    return {"message": "Medición eliminada"}
