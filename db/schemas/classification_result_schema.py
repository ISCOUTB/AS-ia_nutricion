classification_result_schema = {
    "bsonType": "object",
    "required": ["child_id", "resultado", "modelo", "fecha_resultado"],
    "properties": {
        "child_id": {"bsonType": "objectId"},
        "resultado": {"bsonType": "string"},
        "modelo": {"bsonType": "string"},
        "fecha_resultado": {"bsonType": "date"}
    }
}
