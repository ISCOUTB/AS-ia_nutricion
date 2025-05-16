from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AuditLog(BaseModel):
    id: Optional[str] = Field(alias="_id")
    user_id: str
    action: str
    timestamp: Optional[datetime] = None
    ip_address: Optional[str] = None
    details: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
