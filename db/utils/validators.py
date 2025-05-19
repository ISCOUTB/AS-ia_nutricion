from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

def initialize_collections(db):
    """
    Crea las colecciones si no existen aún.
    (Sin validación por JSON Schema, ya que Cosmos DB vCore no lo admite)
    """
    existing_collections = db.list_collection_names()

    required_collections = [
        "usuarios", "roles", "ninos", "historial_medico", "datos_antropometricos",
        "datos_conductuales", "resultados_clasificacion", "audit_log", "household"
    ]

    for name in required_collections:
        if name not in existing_collections:
            db.create_collection(name)
            print(f"✅ Colección '{name}' creada.")
        else:
            print(f"🔎 Colección '{name}' ya existe. No se modifica.")

