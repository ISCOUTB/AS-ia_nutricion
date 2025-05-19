child_schema = {
    "bsonType": "object",
    "required": ["nombre", "apellido", "tipo_documento", "documento", "fecha_nacimiento", "sexo", "direccion", "nombre_acudiente", "telefono_acudiente"],
    "properties": {
        "nombre": {"bsonType": "string"},
        "apellido": {"bsonType": "string"},
        "tipo_documento": {"bsonType": "string"},
        "documento": {"bsonType": "string"},
        "fecha_nacimiento": {"bsonType": "date"},
        "sexo": {"bsonType": "string", "enum": ["M", "F"]},
        "direccion": {"bsonType": "string"},
        "nombre_acudiente": {"bsonType": "string"},
        "telefono_acudiente": {"bsonType": "string"},
        "institucion": {"bsonType": ["string", "null"]},
        "barrio": {"bsonType": ["string", "null"]}
    }
}
