from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional
from db.models.base import BaseDBModel, PyObjectId, SexoEnum

# === Modelo para crear un nuevo niño ===
class ChildCreate(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: SexoEnum
    direccion: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: str
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: str
    consentimiento_informado: bool = False

    @field_validator('consentimiento_informado')
    def validate_consentimiento(cls, v):
        if not v:
            raise ValueError('El consentimiento informado debe ser True para crear un registro')
        return v

    @field_validator('nombre', 'apellido', 'nombre_acudiente')
    def validate_names(cls, v):
        if not v or not v.strip():
            raise ValueError('Los nombres no pueden estar vacíos')
        return v.strip().title()

    @field_validator('documento')
    def validate_documento(cls, v):
        if not v or not v.strip():
            raise ValueError('El documento es obligatorio')
        return v.strip()

    @field_validator('telefono_acudiente')
    def validate_telefono(cls, v):
        if not v or not v.strip():
            raise ValueError('El teléfono del acudiente es obligatorio')
        # Validación básica de formato de teléfono
        clean_phone = v.strip().replace(' ', '').replace('-', '').replace('+', '')
        if not clean_phone.isdigit() or len(clean_phone) < 7:
            raise ValueError('Formato de teléfono inválido')
        return v.strip()

    @field_validator('fecha_nacimiento')
    def validate_fecha_nacimiento(cls, v):
        if v > date.today():
            raise ValueError('La fecha de nacimiento no puede ser futura')
        # Validar edad mínima y máxima razonable (ej: 0-18 años)
        age = (date.today() - v).days // 365
        if age > 18:
            raise ValueError('La edad no puede ser mayor a 18 años')
        return v

    @field_validator('tipo_documento')
    def validate_tipo_documento(cls, v):
        if not v or not v.strip():
            raise ValueError('El tipo de documento es obligatorio')
        
        valid_types = ['CC', 'TI', 'RC', 'CE', 'PA']  # Ajusta según tu país
        clean_type = v.strip().upper()
        
        if clean_type not in valid_types:
            raise ValueError(f'Tipo de documento debe ser uno de: {", ".join(valid_types)}')
        
        return clean_type

# === Modelo para actualizar (todos los campos opcionales) ===
class ChildUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    tipo_documento: Optional[str] = None
    documento: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    sexo: Optional[SexoEnum] = None
    direccion: Optional[str] = None
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: Optional[str] = None
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: Optional[str] = None
    consentimiento_informado: Optional[bool] = None

    @field_validator('nombre', 'apellido', 'nombre_acudiente')
    def validate_names(cls, v):
        if v is not None and v.strip():
            return v.strip().title()
        return v

    @field_validator('documento')
    def validate_documento(cls, v):
        if v is not None and not v.strip():
            raise ValueError('El documento no puede estar vacío')
        return v.strip() if v else v

    @field_validator('telefono_acudiente')
    def validate_telefono(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('El teléfono del acudiente no puede estar vacío')
            clean_phone = v.strip().replace(' ', '').replace('-', '').replace('+', '')
            if not clean_phone.isdigit() or len(clean_phone) < 7:
                raise ValueError('Formato de teléfono inválido')
        return v.strip() if v else v

    @field_validator('fecha_nacimiento')
    def validate_fecha_nacimiento(cls, v):
        if v is not None:
            if v > date.today():
                raise ValueError('La fecha de nacimiento no puede ser futura')
            age = (date.today() - v).days // 365
            if age > 18:
                raise ValueError('La edad no puede ser mayor a 18 años')
        return v

    @field_validator('tipo_documento')
    def validate_tipo_documento(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('El tipo de documento no puede estar vacío')
            
            valid_types = ['CC', 'TI', 'RC', 'CE', 'PA']
            clean_type = v.strip().upper()
            
            if clean_type not in valid_types:
                raise ValueError(f'Tipo de documento debe ser uno de: {", ".join(valid_types)}')
            
            return clean_type
        return v

# === Modelo completo para respuesta desde la DB ===
class ChildInDB(ChildCreate, BaseDBModel):
    pass

# === Modelo para respuesta API (sin campos sensibles si los hay) ===
class ChildInResponse(BaseModel):
    id: PyObjectId
    nombre: str
    apellido: str
    tipo_documento: str
    documento: str
    fecha_nacimiento: date
    sexo: SexoEnum
    direccion: str
    institucion: Optional[str] = None
    barrio: Optional[str] = None
    nombre_acudiente: str
    parentesco_acudiente: Optional[str] = None
    telefono_acudiente: str
    consentimiento_informado: bool

    class Config:
        from_attributes = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            PyObjectId: str,
        }

# === Modelo para listado (campos esenciales) ===
class ChildSummary(BaseModel):
    id: PyObjectId
    nombre: str
    apellido: str
    documento: str
    fecha_nacimiento: date
    sexo: SexoEnum
    institucion: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            PyObjectId: str,
        }