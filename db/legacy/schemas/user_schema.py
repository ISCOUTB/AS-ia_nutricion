user_schema = {
    "bsonType": "object",
    "required": ["email", "password_hash", "is_active"],
    "properties": {
        "email": {
            "bsonType": "string",
            "pattern": "^.+@.+$",
            "description": "Debe ser un email válido"
        },
        "password_hash": {"bsonType": "string"},
        "role_id": {
            "bsonType": ["objectId", "null"],
            "description": "Referencia al rol del usuario"
        },
        "created_at": {"bsonType": "date"},
        "is_active": {"bsonType": "bool"}
    }
}
