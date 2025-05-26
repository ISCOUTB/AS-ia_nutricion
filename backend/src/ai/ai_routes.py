from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from .ai_models import EstadoNutricionalInput
from .ai_service import (
    predecir_estado_nutricional, 
    preprocess_input, 
    obtener_historial_clasificaciones
)

ai_router = APIRouter(prefix="/ai", tags=["Inteligencia Artificial"])


@ai_router.post("/predecir-estado/{child_id}")
def predecir_estado(child_id: str, input_data: EstadoNutricionalInput, save_to_db: bool = True):
    """
    Realiza predicción del estado nutricional para un niño específico
    
    Args:
        child_id: ID del niño
        input_data: Datos de entrada para la predicción
        save_to_db: Si guardar o no el resultado en la base de datos (default: True)
    """
    try:
        # Validar que el child_id sea un ObjectId válido
        if not ObjectId.is_valid(child_id):
            raise HTTPException(
                status_code=400, 
                detail="ID de niño no válido"
            )
        
        # Preprocesar datos de entrada
        processed_data = preprocess_input(input_data)
        
        # Realizar predicción
        resultado = predecir_estado_nutricional(
            data_dict=processed_data,
            child_id=child_id,
            save_to_db=save_to_db
        )
        
        return {
            "success": True,
            "data": resultado,
            "message": "Predicción realizada exitosamente"
        }
        
    except HTTPException as e:
        # Re-lanzar HTTPException tal cual
        raise e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Esto atrapará cualquier otra excepción no esperada
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@ai_router.get("/historial/{child_id}")
def obtener_historial(child_id: str, limit: int = Query(default=10, ge=1, le=50)):
    """
    Obtiene el historial de clasificaciones para un niño específico
    
    Args:
        child_id: ID del niño
        limit: Número máximo de resultados a retornar (1-50)
    """
    try:
        # Validar que el child_id sea un ObjectId válido
        if not ObjectId.is_valid(child_id):
            raise HTTPException(
                status_code=400, 
                detail="ID de niño no válido"
            )
        
        # Obtener historial
        historial = obtener_historial_clasificaciones(child_id, limit)
        
        return {
            "success": True,
            "data": {
                "child_id": child_id,
                "historial": historial,
                "total_resultados": len(historial)
            },
            "message": "Historial obtenido exitosamente"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno del servidor: {str(e)}"
        )


@ai_router.get("/estadisticas/{child_id}")
def obtener_estadisticas_nino(child_id: str):
    """
    Obtiene estadísticas de clasificaciones para un niño específico
    """
    try:
        if not ObjectId.is_valid(child_id):
            raise HTTPException(
                status_code=400, 
                detail="ID de niño no válido"
            )
        
        historial = obtener_historial_clasificaciones(child_id, limit=100)
        
        if not historial:
            return {
                "success": True,
                "data": {
                    "child_id": child_id,
                    "total_predicciones": 0,
                    "estadisticas": {}
                },
                "message": "No hay predicciones para este niño"
            }
        
        # Calcular estadísticas básicas
        total_predicciones = len(historial)
        resultados_count = {}
        confidence_scores = []
        
        for item in historial:
            resultado = item["resultado"]
            resultados_count[resultado] = resultados_count.get(resultado, 0) + 1
            
            if item.get("confidence_score"):
                confidence_scores.append(item["confidence_score"])
        
        # Calcular promedio de confidence score
        avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
        
        # Resultado más frecuente
        resultado_mas_frecuente = max(resultados_count, key=resultados_count.get) if resultados_count else None
        
        return {
            "success": True,
            "data": {
                "child_id": child_id,
                "total_predicciones": total_predicciones,
                "estadisticas": {
                    "distribucion_resultados": resultados_count,
                    "resultado_mas_frecuente": resultado_mas_frecuente,
                    "confidence_promedio": round(avg_confidence, 3),
                    "ultima_prediccion": historial[0] if historial else None
                }
            },
            "message": "Estadísticas obtenidas exitosamente"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno del servidor: {str(e)}"
        )