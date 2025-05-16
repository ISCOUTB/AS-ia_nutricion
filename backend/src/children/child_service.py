from db.database import db
from bson import ObjectId
from child_models import Child
from typing import Optional, List

children_collection = db["ninos"]

# Crear nuevo niño
def create_child(child_data: Child) -> str:
    child_dict = child_data.dict(by_alias=True, exclude_unset=True)
    result = children_collection.insert_one(child_dict)
    return str(result.inserted_id)

# Obtener todos los niños
def get_all_children() -> List[Child]:
    children = children_collection.find()
    return [Child(**child) for child in children]

# Obtener un niño por ID
def get_child_by_id(child_id: str) -> Optional[Child]:
    child = children_collection.find_one({"_id": ObjectId(child_id)})
    if child:
        return Child(**child)
    return None

# Actualizar niño por ID
def update_child(child_id: str, updated_data: dict) -> bool:
    result = children_collection.update_one(
        {"_id": ObjectId(child_id)},
        {"$set": updated_data}
    )
    return result.modified_count > 0

# Eliminar niño por ID (eliminación real)
def delete_child(child_id: str) -> bool:
    result = children_collection.delete_one({"_id": ObjectId(child_id)})
    return result.deleted_count > 0
