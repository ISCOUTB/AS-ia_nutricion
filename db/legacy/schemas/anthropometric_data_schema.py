anthropometric_data_schema = {
    "bsonType": "object",
    "required": ["child_id", "peso", "talla", "imc", "fecha_medicion"],
    "properties": {
        "child_id": {"bsonType": "objectId"},
        "peso": {"bsonType": "double"},
        "talla": {"bsonType": "double"},
        "imc": {"bsonType": "double"},
        "fecha_medicion": {"bsonType": "date"}
    }
}
