household_schema = {
    "bsonType": "object",
    "required": ["location_type"],
    "properties": {
        "location_type": {"bsonType": "string", "enum": ["urbano", "rural"]},
        "caregiver_education_level": {"bsonType": ["string", "null"]},
        "monthly_income": {"bsonType": ["double", "null"]},
        "food_security": {"bsonType": ["string", "null"], "enum": ["seguro", "moderado", "grave", None]},
        "water_access": {"bsonType": ["bool", "null"]},
        "government_aid": {"bsonType": ["array", "null"], "items": {"bsonType": "string"}}
    }
}
