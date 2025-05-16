audit_log_schema = {
    "bsonType": "object",
    "required": ["user_id", "action"],
    "properties": {
        "user_id": {"bsonType": "objectId"},
        "action": {"bsonType": "string"},
        "timestamp": {"bsonType": "date"},
        "ip_address": {"bsonType": ["string", "null"]},
        "details": {"bsonType": ["string", "null"]}
    }
}
