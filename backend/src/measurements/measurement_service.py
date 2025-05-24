from db.database import db
from bson import ObjectId
from bson.errors import InvalidId
from typing import Optional, List
from .measurement_models import Measurement, MeasurementCreate
import logging

logger = logging.getLogger(__name__)

# Usar el nombre correcto de la colección según database.py
measurements_collection = db["datos_antropometricos"]

def create_measurement(measurement_data: MeasurementCreate) -> str:
    """Crear una nueva medición"""
    try:
        # Convertir a dict excluyendo campos no establecidos
        data = measurement_data.model_dump(exclude_unset=True)
        
        # Calcular IMC
        peso = data["peso"]
        talla = data["talla"]
        talla_m = talla / 100
        data["imc"] = round(peso / (talla_m ** 2), 2)
        
        # Convertir PyObjectId a ObjectId para MongoDB
        if "child_id" in data:
            data["child_id"] = ObjectId(data["child_id"])
        
        result = measurements_collection.insert_one(data)
        logger.info(f"Medición creada con ID: {result.inserted_id}")
        return str(result.inserted_id)
        
    except Exception as e:
        logger.error(f"Error creando medición: {e}")
        raise

def get_all_measurements() -> List[Measurement]:
    """Obtener todas las mediciones"""
    try:
        results = measurements_collection.find()
        measurements = []
        
        for doc in results:
            try:
                # Convertir ObjectId a string para el modelo
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                if "child_id" in doc:
                    doc["child_id"] = str(doc["child_id"])
                    
                measurement = Measurement(**doc)
                measurements.append(measurement)
            except Exception as e:
                logger.warning(f"Error procesando documento {doc.get('_id')}: {e}")
                continue
                
        return measurements
        
    except Exception as e:
        logger.error(f"Error obteniendo mediciones: {e}")
        raise

def get_measurements_by_child(child_id: str) -> List[Measurement]:
    """Obtener todas las mediciones de un niño por su ID"""
    try:
        # Validar ObjectId
        if not ObjectId.is_valid(child_id):
            raise ValueError(f"ID de niño inválido: {child_id}")
            
        results = measurements_collection.find({"child_id": ObjectId(child_id)})
        measurements = []
        
        for doc in results:
            try:
                # Convertir ObjectIds a string
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                if "child_id" in doc:
                    doc["child_id"] = str(doc["child_id"])
                    
                measurement = Measurement(**doc)
                measurements.append(measurement)
            except Exception as e:
                logger.warning(f"Error procesando documento {doc.get('_id')}: {e}")
                continue
                
        return measurements
        
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise
    except Exception as e:
        logger.error(f"Error obteniendo mediciones del niño {child_id}: {e}")
        raise

def get_measurement_by_id(measurement_id: str) -> Optional[Measurement]:
    """Obtener una medición específica por su ID"""
    try:
        # Validar ObjectId
        if not ObjectId.is_valid(measurement_id):
            raise ValueError(f"ID de medición inválido: {measurement_id}")
            
        doc = measurements_collection.find_one({"_id": ObjectId(measurement_id)})
        
        if doc:
            # Convertir ObjectIds a string
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            if "child_id" in doc:
                doc["child_id"] = str(doc["child_id"])
                
            return Measurement(**doc)
        return None
        
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise
    except Exception as e:
        logger.error(f"Error obteniendo medición {measurement_id}: {e}")
        raise

def update_measurement(measurement_id: str, updated_data: dict) -> bool:
    """Actualizar una medición (peso, talla y recalcular IMC si cambian)"""
    try:
        # Validar ObjectId
        if not ObjectId.is_valid(measurement_id):
            raise ValueError(f"ID de medición inválido: {measurement_id}")
        
        # Crear una copia para no modificar el original
        update_data = updated_data.copy()
        
        # Recalcular IMC si se actualiza peso o talla
        if "peso" in update_data or "talla" in update_data:
            # Obtener la medición actual para tener todos los datos
            current_measurement = measurements_collection.find_one({"_id": ObjectId(measurement_id)})
            if not current_measurement:
                return False
            
            peso = update_data.get("peso", current_measurement.get("peso"))
            talla = update_data.get("talla", current_measurement.get("talla"))
            
            if peso and talla:
                talla_m = talla / 100
                update_data["imc"] = round(peso / (talla_m ** 2), 2)
        
        # Convertir child_id si viene en los datos de actualización
        if "child_id" in update_data:
            update_data["child_id"] = ObjectId(update_data["child_id"])
        
        result = measurements_collection.update_one(
            {"_id": ObjectId(measurement_id)},
            {"$set": update_data}
        )
        
        success = result.modified_count > 0
        if success:
            logger.info(f"Medición {measurement_id} actualizada exitosamente")
        else:
            logger.warning(f"No se pudo actualizar la medición {measurement_id}")
            
        return success
        
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise
    except Exception as e:
        logger.error(f"Error actualizando medición {measurement_id}: {e}")
        raise

def delete_measurement(measurement_id: str) -> bool:
    """Eliminar una medición"""
    try:
        # Validar ObjectId
        if not ObjectId.is_valid(measurement_id):
            raise ValueError(f"ID de medición inválido: {measurement_id}")
            
        result = measurements_collection.delete_one({"_id": ObjectId(measurement_id)})
        
        success = result.deleted_count > 0
        if success:
            logger.info(f"Medición {measurement_id} eliminada exitosamente")
        else:
            logger.warning(f"No se pudo eliminar la medición {measurement_id}")
            
        return success
        
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise
    except Exception as e:
        logger.error(f"Error eliminando medición {measurement_id}: {e}")
        raise

def get_latest_measurement_by_child(child_id: str) -> Optional[Measurement]:
    """Obtener la medición más reciente de un niño"""
    try:
        if not ObjectId.is_valid(child_id):
            raise ValueError(f"ID de niño inválido: {child_id}")
            
        doc = measurements_collection.find_one(
            {"child_id": ObjectId(child_id)},
            sort=[("fecha_medicion", -1)]  # Ordenar por fecha descendente
        )
        
        if doc:
            # Convertir ObjectIds a string
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            if "child_id" in doc:
                doc["child_id"] = str(doc["child_id"])
                
            return Measurement(**doc)
        return None
        
    except ValueError as e:
        logger.error(f"Error de validación: {e}")
        raise
    except Exception as e:
        logger.error(f"Error obteniendo última medición del niño {child_id}: {e}")
        raise