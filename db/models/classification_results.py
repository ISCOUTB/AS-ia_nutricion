from pydantic import BaseModel
from datetime import datetime

class ClassificationResult(BaseModel):
    child_id: str
    resultado: str  # ej. 'Desnutrición', 'Normal', 'Sobrepeso'
    modelo: str     # nombre del modelo usado
    fecha_resultado: datetime
