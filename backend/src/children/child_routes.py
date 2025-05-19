from fastapi import APIRouter, HTTPException, status
from typing import List
from child_models import ChildCreate, ChildUpdate, ChildInResponse
from child_service import (
    create_child,
    get_all_children,
    get_child_by_id,
    update_child,
    delete_child
)

child_router = APIRouter(
    prefix="/children",
    tags=["Gestión de Niños"]
)

# === Crear niño ===
@child_router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create(child: ChildCreate):
    child_id = create_child(child)
    return {"message": "Niño registrado", "child_id": child_id}

# === Obtener todos los niños ===
@child_router.get("/", response_model=List[ChildInResponse])
def read_all():
    return get_all_children()

# === Obtener un niño por ID ===
@child_router.get("/{child_id}", response_model=ChildInResponse)
def read_one(child_id: str):
    child = get_child_by_id(child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    return child

# === Actualizar un niño por ID ===
@child_router.put("/{child_id}", response_model=dict)
def update(child_id: str, updated_data: ChildUpdate):
    if not updated_data.dict(exclude_unset=True):
        raise HTTPException(status_code=400, detail="No se proporcionaron campos para actualizar")

    success = update_child(child_id, updated_data)
    if not success:
        raise HTTPException(status_code=404, detail="No se pudo actualizar el niño")
    return {"message": "Niño actualizado"}

# === Eliminar un niño por ID ===
@child_router.delete("/{child_id}", response_model=dict)
def delete(child_id: str):
    success = delete_child(child_id)
    if not success:
        raise HTTPException(status_code=404, detail="No se pudo eliminar el niño")
    return {"message": "Niño eliminado"}
