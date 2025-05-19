medical_history_schema = {
    "bsonType": "object",
    "required": ["child_id", "fecha_registro"],
    "properties": {
        "child_id": {"bsonType": "objectId"},
        "enfermedades": {"bsonType": ["string", "null"]},
        "medicamentos": {"bsonType": ["string", "null"]},
        "alergias": {"bsonType": ["string", "null"]},
        "antecedentes_familiares": {"bsonType": ["string", "null"]},
        "fecha_registro": {"bsonType": "date"}
    }
}
