from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class User(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    role_id: str  # ID de la colección roles
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    is_active: bool = True