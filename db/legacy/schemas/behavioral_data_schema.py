behavioral_data_schema = {
    "bsonType": "object",
    "required": ["child_id", "consumo_frutas", "consumo_verduras", "actividad_fisica", "fecha_registro"],
    "properties": {
        "child_id": {"bsonType": "objectId"},
        "consumo_frutas": {"bsonType": "bool"},
        "consumo_verduras": {"bsonType": "bool"},
        "actividad_fisica": {"bsonType": "bool"},
        "tiempo_pantalla": {"bsonType": ["double", "null"]},
        "fecha_registro": {"bsonType": "date"}
    }
}
