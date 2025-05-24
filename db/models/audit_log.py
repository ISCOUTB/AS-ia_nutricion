from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, timezone
from .base import BaseDBModel, PyObjectId


class AuditLogCreate(BaseModel):
    user_id: PyObjectId
    action: str
    timestamp: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None
    details: Optional[str] = None

    @field_validator('action')
    def validate_action(cls, v):
        if not v or not v.strip():
            raise ValueError('La acción es obligatoria')
        
        valid_actions = [
            'login', 'logout', 'create_child', 'update_child', 'delete_child',
            'create_measurement', 'update_measurement', 'delete_measurement',
            'run_classification', 'export_data', 'import_data'
        ]
        
        clean_action = v.strip().lower()
        if clean_action not in valid_actions:
            raise ValueError(f'Acción debe ser una de: {", ".join(valid_actions)}')
        
        return clean_action

    @field_validator('ip_address')
    def validate_ip_address(cls, v):
        if v is not None:
            import re
            # Validación básica de IP (IPv4)
            ip_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
            if not re.match(ip_pattern, v.strip()):
                raise ValueError('Formato de IP inválido')
            return v.strip()
        return v

    @field_validator('details')
    def validate_details(cls, v):
        if v is not None:
            if len(v.strip()) > 500:
                raise ValueError('Los detalles no pueden exceder 500 caracteres')
            return v.strip() if v.strip() else None
        return v


class AuditLogInDB(AuditLogCreate, BaseDBModel):
    pass