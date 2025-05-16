from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    username: str
    email: EmailStr
    password_hash: str
    role_id: str  # ID de la colección roles
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    is_active: bool = True
    
    class Config:
        allow_population_by_field_name = True