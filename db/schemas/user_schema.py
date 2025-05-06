user_schema = {
    "bsonType": "object",
    "required": ["username", "email", "password_hash", "role_id", "is_active"],
    "properties": {
        "username": {"bsonType": "string"},
        "email": {"bsonType": "string", "pattern": "^.+@.+$"},
        "password_hash": {"bsonType": "string"},
        "role_id": {"bsonType": "objectId"},
        "created_at": {"bsonType": "date"},
        "is_active": {"bsonType": "bool"}
    }
}
