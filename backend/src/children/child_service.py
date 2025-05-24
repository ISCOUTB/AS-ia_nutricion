from db.database import db
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from .child_models import ChildCreate, ChildUpdate, ChildInDB, ChildInResponse, ChildSummary
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

# Conexión a la colección de niños (usando el nombre correcto de tu estructura)
children_collection = db["children"]

# === Crear nuevo niño ===
def create_child(child_data: ChildCreate) -> str:
    """
    Crea un nuevo registro de niño en la base de datos.
    
    Args:
        child_data: Datos del niño a crear
        
    Returns:
        str: ID del niño creado
        
    Raises:
        ValueError: Si ya existe un niño con el mismo documento
        Exception: Para otros errores de base de datos
    """
    try:
        # Convertir el modelo Pydantic a dict
        child_dict = child_data.model_dump(exclude_unset=True)
        
        # Insertar en la base de datos
        result = children_collection.insert_one(child_dict)
        
        logger.info(f"Niño creado exitosamente con ID: {result.inserted_id}")
        return str(result.inserted_id)
        
    except DuplicateKeyError:
        logger.error(f"Ya existe un niño con documento {child_data.tipo_documento}: {child_data.documento}")
        raise ValueError("Ya existe un niño registrado con este tipo y número de documento")
    except Exception as e:
        logger.error(f"Error creando niño: {e}")
        raise Exception(f"Error al crear el niño: {str(e)}")

# === Obtener todos los niños (resumen) ===
def get_all_children() -> List[ChildSummary]:
    """
    Obtiene un resumen de todos los niños registrados.
    
    Returns:
        List[ChildSummary]: Lista de resúmenes de niños
    """
    try:
        # Proyección para obtener solo campos necesarios
        projection = {
            "nombre": 1,
            "apellido": 1,
            "documento": 1,
            "fecha_nacimiento": 1,
            "sexo": 1,
            "institucion": 1
        }
        
        children_cursor = children_collection.find({}, projection)
        children_list = []
        
        for child in children_cursor:
            try:
                child_summary = ChildSummary(
                    id=child["_id"],
                    nombre=child["nombre"],
                    apellido=child["apellido"],
                    documento=child["documento"],
                    fecha_nacimiento=child["fecha_nacimiento"],
                    sexo=child["sexo"],
                    institucion=child.get("institucion")
                )
                children_list.append(child_summary)
            except Exception as e:
                logger.warning(f"Error procesando niño {child.get('_id', 'unknown')}: {e}")
                continue
        
        logger.info(f"Se obtuvieron {len(children_list)} niños")
        return children_list
        
    except Exception as e:
        logger.error(f"Error obteniendo lista de niños: {e}")
        raise Exception(f"Error al obtener la lista de niños: {str(e)}")

# === Obtener niño por ID ===
def get_child_by_id(child_id: str) -> Optional[ChildInResponse]:
    """
    Obtiene un niño específico por su ID.
    
    Args:
        child_id: ID del niño a buscar
        
    Returns:
        Optional[ChildInResponse]: Datos del niño o None si no existe
    """
    try:
        obj_id = ObjectId(child_id)
    except InvalidId:
        logger.warning(f"ID inválido proporcionado: {child_id}")
        return None

    try:
        child = children_collection.find_one({"_id": obj_id})
        
        if child:
            return ChildInResponse(
                id=child["_id"],
                nombre=child["nombre"],
                apellido=child["apellido"],
                tipo_documento=child["tipo_documento"],
                documento=child["documento"],
                fecha_nacimiento=child["fecha_nacimiento"],
                sexo=child["sexo"],
                direccion=child["direccion"],
                institucion=child.get("institucion"),
                barrio=child.get("barrio"),
                nombre_acudiente=child["nombre_acudiente"],
                parentesco_acudiente=child.get("parentesco_acudiente"),
                telefono_acudiente=child["telefono_acudiente"],
                consentimiento_informado=child["consentimiento_informado"]
            )
        
        logger.info(f"Niño no encontrado con ID: {child_id}")
        return None
        
    except Exception as e:
        logger.error(f"Error obteniendo niño por ID {child_id}: {e}")
        raise Exception(f"Error al obtener el niño: {str(e)}")

# === Actualizar niño por ID ===
def update_child(child_id: str, updated_data: ChildUpdate) -> bool:
    """
    Actualiza los datos de un niño existente.
    
    Args:
        child_id: ID del niño a actualizar
        updated_data: Datos a actualizar
        
    Returns:
        bool: True si se actualizó exitosamente, False si no se encontró
        
    Raises:
        ValueError: Si hay conflicto con documento existente
        Exception: Para otros errores de base de datos
    """
    try:
        obj_id = ObjectId(child_id)
    except InvalidId:
        logger.warning(f"ID inválido proporcionado para actualización: {child_id}")
        return False

    try:
        # Obtener solo los campos que tienen valores
        update_dict = updated_data.model_dump(exclude_unset=True, exclude_none=True)
        
        if not update_dict:
            logger.warning(f"No hay campos para actualizar en niño {child_id}")
            return False

        # Verificar que el documento existe
        existing = children_collection.find_one({"_id": obj_id})
        if not existing:
            logger.warning(f"Niño no encontrado para actualización: {child_id}")
            return False

        # Si se está actualizando documento, verificar que no exista otro igual
        if "documento" in update_dict or "tipo_documento" in update_dict:
            tipo_doc = update_dict.get("tipo_documento", existing["tipo_documento"])
            num_doc = update_dict.get("documento", existing["documento"])
            
            existing_with_doc = children_collection.find_one({
                "tipo_documento": tipo_doc,
                "documento": num_doc,
                "_id": {"$ne": obj_id}
            })
            
            if existing_with_doc:
                raise ValueError("Ya existe otro niño con este tipo y número de documento")

        # Realizar la actualización
        result = children_collection.update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )
        
        success = result.modified_count > 0
        if success:
            logger.info(f"Niño actualizado exitosamente: {child_id}")
        else:
            logger.warning(f"No se realizaron cambios en niño: {child_id}")
            
        return success
        
    except ValueError:
        # Re-raise ValueError para manejo específico
        raise
    except Exception as e:
        logger.error(f"Error actualizando niño {child_id}: {e}")
        raise Exception(f"Error al actualizar el niño: {str(e)}")

# === Eliminar niño por ID ===
def delete_child(child_id: str) -> bool:
    """
    Elimina un niño y todos sus datos relacionados.
    
    Args:
        child_id: ID del niño a eliminar
        
    Returns:
        bool: True si se eliminó exitosamente, False si no se encontró
        
    Raises:
        Exception: Para errores de base de datos
    """
    try:
        obj_id = ObjectId(child_id)
    except InvalidId:
        logger.warning(f"ID inválido proporcionado para eliminación: {child_id}")
        return False

    try:
        # Verificar que el niño existe
        existing = children_collection.find_one({"_id": obj_id})
        if not existing:
            logger.warning(f"Niño no encontrado para eliminación: {child_id}")
            return False

        # Eliminar datos relacionados primero
        related_collections = [
            "anthropometric_data",
            "behavioral_data", 
            "medical_history",
            "classification_results"
        ]
        
        for collection_name in related_collections:
            try:
                result = db[collection_name].delete_many({"child_id": obj_id})
                if result.deleted_count > 0:
                    logger.info(f"Eliminados {result.deleted_count} registros de {collection_name} para niño {child_id}")
            except Exception as e:
                logger.warning(f"Error eliminando datos de {collection_name} para niño {child_id}: {e}")

        # Eliminar el niño
        result = children_collection.delete_one({"_id": obj_id})
        
        success = result.deleted_count > 0
        if success:
            logger.info(f"Niño eliminado exitosamente: {child_id}")
        
        return success
        
    except Exception as e:
        logger.error(f"Error eliminando niño {child_id}: {e}")
        raise Exception(f"Error al eliminar el niño: {str(e)}")

# === Buscar niños por criterios ===
def search_children(
    nombre: Optional[str] = None,
    apellido: Optional[str] = None,
    documento: Optional[str] = None,
    institucion: Optional[str] = None,
    sexo: Optional[str] = None
) -> List[ChildSummary]:
    """
    Busca niños por diferentes criterios.
    
    Args:
        nombre: Nombre a buscar (búsqueda parcial)
        apellido: Apellido a buscar (búsqueda parcial)
        documento: Documento a buscar (búsqueda exacta)
        institucion: Institución a buscar
        sexo: Sexo a buscar
        
    Returns:
        List[ChildSummary]: Lista de niños que coinciden con los criterios
    """
    try:
        # Construir filtros de búsqueda
        filters = {}
        
        if nombre:
            filters["nombre"] = {"$regex": nombre, "$options": "i"}
        if apellido:
            filters["apellido"] = {"$regex": apellido, "$options": "i"}
        if documento:
            filters["documento"] = documento
        if institucion:
            filters["institucion"] = {"$regex": institucion, "$options": "i"}
        if sexo:
            filters["sexo"] = sexo

        # Proyección para obtener solo campos necesarios
        projection = {
            "nombre": 1,
            "apellido": 1,
            "documento": 1,
            "fecha_nacimiento": 1,
            "sexo": 1,
            "institucion": 1
        }
        
        children_cursor = children_collection.find(filters, projection)
        children_list = []
        
        for child in children_cursor:
            try:
                child_summary = ChildSummary(
                    id=child["_id"],
                    nombre=child["nombre"],
                    apellido=child["apellido"],
                    documento=child["documento"],
                    fecha_nacimiento=child["fecha_nacimiento"],
                    sexo=child["sexo"],
                    institucion=child.get("institucion")
                )
                children_list.append(child_summary)
            except Exception as e:
                logger.warning(f"Error procesando niño en búsqueda {child.get('_id', 'unknown')}: {e}")
                continue
        
        logger.info(f"Búsqueda completada: {len(children_list)} niños encontrados")
        return children_list
        
    except Exception as e:
        logger.error(f"Error en búsqueda de niños: {e}")
        raise Exception(f"Error al buscar niños: {str(e)}")