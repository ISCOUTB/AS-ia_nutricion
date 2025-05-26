from fastapi import APIRouter
from .ai_models import EstadoNutricionalInput 
from .ai_service import predecir_estado_nutricional

router = APIRouter()

@router.post("/predecir-estado")
def predecir_estado(input_data: EstadoNutricionalInput):
    resultado = predecir_estado_nutricional(input_data.dict())
    return {"estado_nutricional": resultado}
