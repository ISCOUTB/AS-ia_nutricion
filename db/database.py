from pymongo import MongoClient
from pymongo.errors import CollectionInvalid, ConnectionFailure
import logging
import os
from .utils.validators import initialize_collections

logger = logging.getLogger(__name__)

# Configuración de conexión desde variables de entorno
MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = "NutriKids"

try:
    # Crear cliente MongoDB
    client = MongoClient(MONGO_URL)
    
    # Probar conexión
    client.admin.command('ping')
    
    # Obtener base de datos
    db = client[DATABASE_NAME]
    
    logger.info(f"✅ Conectado exitosamente a MongoDB: {DATABASE_NAME}")
    
except ConnectionFailure as e:
    logger.error(f"❌ Error conectando a MongoDB: {e}")
    raise
except Exception as e:
    logger.error(f"❌ Error inesperado conectando a MongoDB: {e}")
    raise


def create_indexes(db):
    """
    Crea índices importantes para mejorar el rendimiento y garantizar unicidad
    """
    try:
        # Índices para usuarios
        db.users.create_index("email", unique=True)
        db.users.create_index("role_id")
        db.users.create_index("is_active")
        logger.info("✅ Índices creados para 'users'")

        # Índices para roles
        db.roles.create_index("name", unique=True)
        logger.info("✅ Índices creados para 'roles'")

        # Índices para niños
        db.children.create_index([("tipo_documento", 1), ("documento", 1)], unique=True)
        db.children.create_index("fecha_nacimiento")
        db.children.create_index("sexo")
        db.children.create_index("institucion")
        logger.info("✅ Índices creados para 'children'")

        # Índices para datos antropométricos
        db.anthropometric_data.create_index("child_id")
        db.anthropometric_data.create_index("fecha_medicion")
        db.anthropometric_data.create_index([("child_id", 1), ("fecha_medicion", -1)])
        logger.info("✅ Índices creados para 'anthropometric_data'")

        # Índices para datos conductuales
        db.behavioral_data.create_index("child_id")
        db.behavioral_data.create_index("fecha_registro")
        db.behavioral_data.create_index([("child_id", 1), ("fecha_registro", -1)])
        logger.info("✅ Índices creados para 'behavioral_data'")

        # Índices para historial médico
        db.medical_history.create_index("child_id", unique=True)  # Un historial por niño
        db.medical_history.create_index("fecha_registro")
        logger.info("✅ Índices creados para 'medical_history'")

        # Índices para resultados de clasificación
        db.classification_results.create_index("child_id")
        db.classification_results.create_index("fecha_resultado")
        db.classification_results.create_index("modelo")
        db.classification_results.create_index([("child_id", 1), ("fecha_resultado", -1)])
        logger.info("✅ Índices creados para 'classification_results'")

        # Índices para audit log
        db.audit_log.create_index("user_id")
        db.audit_log.create_index("action")
        db.audit_log.create_index("timestamp")
        db.audit_log.create_index([("user_id", 1), ("timestamp", -1)])
        logger.info("✅ Índices creados para 'audit_log'")

        # Índices para households
        db.households.create_index("location_type")
        db.households.create_index("food_security")
        logger.info("✅ Índices creados para 'households'")

    except Exception as e:
        logger.error(f"❌ Error creando índices: {e}")
        # No fallar completamente si hay problemas con índices


def validate_database_health(db):
    """
    Valida que la base de datos esté funcionando correctamente
    """
    try:
        # Verificar que las colecciones existen
        collections = db.list_collection_names()
        required_collections = [
            "users", "roles", "children", "medical_history", 
            "anthropometric_data", "behavioral_data", 
            "classification_results", "audit_log", "households"
        ]
        
        missing_collections = [col for col in required_collections if col not in collections]
        
        if missing_collections:
            logger.warning(f"⚠️ Colecciones faltantes: {missing_collections}")
            return False
        
        # Verificar conectividad básica
        db.command("ping")
        logger.info("✅ Validación de salud de la base de datos exitosa")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error en validación de salud de la base de datos: {e}")
        return False


# Inicializar base de datos al importar
try:
    initialize_collections(db)
    validate_database_health(db)
except Exception as e:
    logger.error(f"❌ Error inicializando base de datos: {e}")