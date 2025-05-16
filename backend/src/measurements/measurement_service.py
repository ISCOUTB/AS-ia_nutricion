from db.database import db
from bson import ObjectId
from typing import Optional, List
from measurement_models import Measurement

measurements_collection = db["datos_antropometricos"]

# Crear una nueva medición
def create_measurement(measurement_data: Measurement) -> str:
    data = measurement_data.dict(by_alias=True, exclude_unset=True)
    result = measurements_collection.insert_one(data)
    return str(result.inserted_id)

# Obtener todas las mediciones
def get_all_measurements() -> List[Measurement]:
    results = measurements_collection.find()
    return [Measurement(**doc) for doc in results]

# Obtener todas las mediciones de un niño por su ID
def get_measurements_by_child(child_id: str) -> List[Measurement]:
    results = measurements_collection.find({"child_id": ObjectId(child_id)})
    return [Measurement(**doc) for doc in results]

# Obtener una medición específica por su ID
def get_measurement_by_id(measurement_id: str) -> Optional[Measurement]:
    doc = measurements_collection.find_one({"_id": ObjectId(measurement_id)})
    if doc:
        return Measurement(**doc)
    return None

# Actualizar una medición (peso, talla y recalcular IMC si cambian)
def update_measurement(measurement_id: str, updated_data: dict) -> bool:
    if "peso" in updated_data and "talla" in updated_data:
        talla_m = updated_data["talla"] / 100
        updated_data["imc"] = round(updated_data["peso"] / (talla_m ** 2), 2)
    result = measurements_collection.update_one(
        {"_id": ObjectId(measurement_id)},
        {"$set": updated_data}
    )
    return result.modified_count > 0

# Eliminar una medición
def delete_measurement(measurement_id: str) -> bool:
    result = measurements_collection.delete_one({"_id": ObjectId(measurement_id)})
    return result.deleted_count > 0
