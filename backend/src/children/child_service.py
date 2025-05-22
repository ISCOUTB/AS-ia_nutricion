from db.database import db
from bson import ObjectId, errors
from .child_models import ChildCreate, ChildUpdate, ChildInResponse
from typing import Optional, List
from datetime import datetime
from bson.errors import InvalidId

# Conexión a la colección de niños
children_collection = db["ninos"]

# === Crear nuevo niño ===
def create_child(child_data: ChildCreate) -> str:
    child_dict = child_data.model_dump(exclude_unset=True)
    child_dict["fecha_nacimiento"] = datetime.combine(child_dict["fecha_nacimiento"], datetime.min.time())
    result = children_collection.insert_one(child_dict)
    return str(result.inserted_id)

# === Obtener todos los niños ===
def get_all_children() -> List[ChildInResponse]:
    children_cursor = children_collection.find()
    return [ChildInResponse(**child) for child in children_cursor]

# === Obtener niño por ID ===
def get_child_by_id(child_id: str) -> Optional[ChildInResponse]:
    try:
        obj_id = ObjectId(child_id)
    except errors.InvalidId:
        return None

    child = children_collection.find_one({"_id": obj_id})
    if child:
        return ChildInResponse(**child)
    return None

# === Actualizar niño por ID ===
def update_child(child_id: str, updated_data: ChildUpdate) -> bool:
    try:
        obj_id = ObjectId(child_id)
    except InvalidId:
        return False

    update_dict = updated_data.model_dump(exclude_unset=True)
    if not update_dict:
        return False  # Nada que actualizar

    existing = children_collection.find_one({"_id": obj_id})
    if not existing:
        return False  # No existe el documento

    result = children_collection.update_one(
        {"_id": obj_id},
        {"$set": update_dict}
    )
    return result.modified_count > 0

# === Eliminar niño por ID ===
def delete_child(child_id: str) -> bool:
    try:
        obj_id = ObjectId(child_id)
    except errors.InvalidId:
        return False

    result = children_collection.delete_one({"_id": obj_id})
    return result.deleted_count > 0

# === Formatear la fecha de nacimiento del niño para recibirlo en la DB ===
def prepare_child_for_db(child: ChildCreate) -> dict:
    data = child.model_dump()
    data["fecha_nacimiento"] = datetime.combine(data["fecha_nacimiento"], datetime.min.time())
    return data