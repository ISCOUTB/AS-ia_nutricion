import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Optional
from bson import ObjectId
from db.database import db
from .model_loader import load_model, load_label_encoder
from .ai_models import EstadoNutricionalInput

model = load_model()
label_encoder = load_label_encoder()

def predecir_estado_nutricional(data_dict: dict, child_id: str, save_to_db: bool = True) -> Dict:
    """
    Predice el estado nutricional y opcionalmente guarda el resultado en la base de datos
    
    Args:
        data_dict: diccionario con los datos de entrada para el modelo
        child_id: ID del niño para quien se hace la predicción
        save_to_db: si guardar o no el resultado en la base de datos
    
    Returns:
        Dict con el resultado de la predicción y metadata
    """
    
    # Convertir a DataFrame
    df = pd.DataFrame([data_dict])
    
    # Realizar predicción
    prediction_encoded = model.predict(df)[0]
    prediction_proba = model.predict_proba(df)[0]
    
    # Decodificar etiqueta
    prediction_label = label_encoder.inverse_transform([prediction_encoded])[0]
    
    # Calcular confidence score (probabilidad más alta)
    confidence_score = float(max(prediction_proba))
    
    # Preparar resultado
    resultado = {
        "estado_nutricional": prediction_label,
        "confidence_score": confidence_score,
        "modelo": "random_forest_v1",  # Ajusta según tu modelo actual
        "child_id": child_id
    }
    
    # Guardar en base de datos si se solicita
    if save_to_db:
        try:
            classification_id = guardar_resultado_clasificacion(
                child_id=child_id,
                resultado=prediction_label,
                confidence_score=confidence_score,
                modelo="random_forest_v1"
            )
            resultado["classification_id"] = str(classification_id)
        except Exception as e:
            print(f"Error guardando resultado en BD: {e}")
            # No fallar la predicción por error en BD
            resultado["db_error"] = str(e)
    
    return resultado


def guardar_resultado_clasificacion(child_id: str, resultado: str, confidence_score: float, modelo: str) -> ObjectId:
    """
    Guarda el resultado de clasificación en la base de datos
    """
    
    # Validar que el child_id existe
    child_exists = db.children.find_one({"_id": ObjectId(child_id)})
    if not child_exists:
        raise ValueError(f"No existe un niño con ID: {child_id}")
    
    # Preparar documento para insertar
    classification_doc = {
        "child_id": ObjectId(child_id),
        "resultado": resultado.lower().strip(),
        "modelo": modelo.lower().strip(),
        "fecha_resultado": datetime.now(timezone.utc),
        "confidence_score": confidence_score
    }
    
    # Insertar en la base de datos
    result = db.classification_results.insert_one(classification_doc)
    
    return result.inserted_id


def preprocess_input(data: EstadoNutricionalInput) -> dict:
    """
    Preprocesa los datos de entrada convirtiendo tipos según sea necesario
    """
    # Campos binarios que pueden ser bool o int
    binarios = [
        'enfermedades', 'medicamentos', 'alergias', 'antecedentes_familiares',
        'consumo_frutas', 'consumo_verduras', 'actividad_fisica'
    ]
    
    data_dict = data.model_dump()
    
    # Procesar campos binarios
    for campo in binarios:
        val = data_dict[campo]
        if isinstance(val, bool):
            data_dict[campo] = int(val)  # False->0, True->1
        elif isinstance(val, int):
            if val not in (0, 1):
                raise ValueError(f"El campo {campo} debe ser 0 o 1 si es int")
        else:
            raise ValueError(f"El campo {campo} debe ser int o bool")
    
    # Convertir water_access si es booleano
    if isinstance(data_dict.get('water_access'), bool):
        data_dict['water_access'] = int(data_dict['water_access'])
    
    return data_dict


def obtener_historial_clasificaciones(child_id: str, limit: int = 10) -> list:
    """
    Obtiene el historial de clasificaciones para un niño específico
    """
    try:
        historial = list(
            db.classification_results
            .find({"child_id": ObjectId(child_id)})
            .sort("fecha_resultado", -1)
            .limit(limit)
        )
        
        # Convertir ObjectId a string para serialización
        for item in historial:
            item["_id"] = str(item["_id"])
            item["child_id"] = str(item["child_id"])
        
        return historial
        
    except Exception as e:
        print(f"Error obteniendo historial: {e}")
        return []