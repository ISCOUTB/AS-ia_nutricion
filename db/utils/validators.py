from pymongo import MongoClient
from pymongo.errors import CollectionInvalid
from schemas.user_schema import user_schema
from schemas.role_schema import role_schema
from schemas.child_schema import child_schema
from schemas.medical_history_schema import medical_history_schema
from schemas.anthropometric_data_schema import anthropometric_data_schema
from schemas.behavioral_data_schema import behavioral_data_schema
from schemas.classification_result_schema import classification_result_schema

# Diccionario de nombres de colección y sus respectivos esquemas
COLLECTION_SCHEMAS = {
    "usuarios": user_schema,
    "roles": role_schema,
    "ninos": child_schema,
    "historial_medico": medical_history_schema,
    "datos_antropometricos": anthropometric_data_schema,
    "datos_conductuales": behavioral_data_schema,
    "resultados_clasificacion": classification_result_schema,
}


def initialize_collections(db):
    """
    Crea las colecciones con validación por esquema si no existen aún.
    """
    existing_collections = db.list_collection_names()

    for name, schema in COLLECTION_SCHEMAS.items():
        if name not in existing_collections:
            try:
                db.create_collection(
                    name,
                    validator={"$jsonSchema": schema},
                    validationLevel="strict"
                )
                print(f"✅ Colección '{name}' creada con validación.")
            except CollectionInvalid:
                print(f"⚠️ Error creando la colección '{name}'. Ya existe.")
        else:
            print(f"🔎 Colección '{name}' ya existe. No se modifica.")
