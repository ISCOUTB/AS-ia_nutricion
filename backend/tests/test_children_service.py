import pytest
import mongomock
from unittest.mock import patch, MagicMock
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from datetime import date, datetime
import backend.src.children.child_service as child_service
from backend.src.children.child_models import ChildCreate, ChildUpdate, SexoEnum
import logging

# ============= FIXTURES =============

@pytest.fixture(autouse=True)
def mock_children_collection(monkeypatch):
    """Mock de la colección de MongoDB"""
    mock_client = mongomock.MongoClient()
    mock_db = mock_client.db
    mock_collection = mock_db["ninos"]
    
    # Las colecciones se crean automáticamente al accederlas, no necesitan asignación directa
    # Solo necesitamos asegurar que existan
    mock_db["datos_antropometricos"]
    mock_db["datos_conductuales"] 
    mock_db["historial_medico"]
    mock_db["resultados_clasificacion"]
    
    monkeypatch.setattr(child_service, "children_collection", mock_collection)
    monkeypatch.setattr(child_service, "db", mock_db)
    return mock_collection

@pytest.fixture
def valid_child_data():
    """Datos válidos para crear un niño"""
    return ChildCreate(
        nombre="Juan Carlos",
        apellido="Pérez González",
        tipo_documento="TI",
        documento="1234567890",
        fecha_nacimiento=date(2010, 5, 15),
        sexo=SexoEnum.MASCULINO,
        direccion="Calle 123 #45-67",
        institucion="Colegio San José",
        barrio="Centro",
        nombre_acudiente="María Elena González",
        parentesco_acudiente="Madre",
        telefono_acudiente="3001234567",
        consentimiento_informado=True
    )

@pytest.fixture
def minimal_child_data():
    """Datos mínimos requeridos para crear un niño"""
    return ChildCreate(
        nombre="Ana",
        apellido="López",
        tipo_documento="RC",
        documento="9876543210",
        fecha_nacimiento=date(2015, 8, 20),
        sexo=SexoEnum.FEMENINO,
        direccion="Carrera 10 #20-30",
        nombre_acudiente="Carlos López",
        telefono_acudiente="3109876543",
        consentimiento_informado=True
    )

# ============= TESTS PARA CREATE_CHILD =============

def test_create_child_success(valid_child_data):
    """Test crear niño exitosamente"""
    child_id = child_service.create_child(valid_child_data)
    
    assert isinstance(child_id, str)
    assert len(child_id) == 24  # Length of ObjectId string
    
    # Verificar que se guardó en la base de datos
    saved_child = child_service.children_collection.find_one({"_id": ObjectId(child_id)})
    assert saved_child is not None
    assert saved_child["nombre"] == "Juan Carlos"
    assert saved_child["apellido"] == "Pérez González"

def test_create_child_minimal_data(minimal_child_data):
    """Test crear niño con datos mínimos"""
    child_id = child_service.create_child(minimal_child_data)
    
    assert isinstance(child_id, str)
    saved_child = child_service.children_collection.find_one({"_id": ObjectId(child_id)})
    assert saved_child["institucion"] is None
    assert saved_child["barrio"] is None
    assert saved_child["parentesco_acudiente"] is None

def test_create_child_duplicate_document(valid_child_data):
    """Test error al crear niño con documento duplicado"""
    # Crear el primer niño
    child_service.create_child(valid_child_data)
    
    # Intentar crear otro con el mismo documento
    duplicate_child = ChildCreate(
        nombre="Pedro",
        apellido="Martínez",
        tipo_documento="TI",
        documento="1234567890",  # Mismo documento
        fecha_nacimiento=date(2011, 3, 10),
        sexo=SexoEnum.MASCULINO,
        direccion="Otra dirección",
        nombre_acudiente="Ana Martínez",
        telefono_acudiente="3002222222",
        consentimiento_informado=True
    )
    
    with patch.object(child_service.children_collection, 'insert_one', side_effect=DuplicateKeyError("duplicate")):
        with pytest.raises(ValueError, match="Ya existe un niño registrado con este tipo y número de documento"):
            child_service.create_child(duplicate_child)

def test_create_child_database_error(valid_child_data):
    """Test error de base de datos al crear niño"""
    with patch.object(child_service.children_collection, 'insert_one', side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="Error al crear el niño"):
            child_service.create_child(valid_child_data)

# ============= TESTS PARA GET_ALL_CHILDREN =============

def test_get_all_children_empty():
    """Test obtener lista vacía de niños"""
    children = child_service.get_all_children()
    assert children == []

def test_get_all_children_multiple(valid_child_data, minimal_child_data):
    """Test obtener múltiples niños"""
    child_service.create_child(valid_child_data)
    child_service.create_child(minimal_child_data)
    
    children = child_service.get_all_children()
    assert len(children) == 2
    
    names = [child.nombre for child in children]
    assert "Juan Carlos" in names
    assert "Ana" in names

def test_get_all_children_with_corrupted_data():
    """Test obtener niños cuando hay datos corruptos"""
    # Insertar un documento válido
    valid_doc = {
        "nombre": "Pedro",
        "apellido": "Sánchez",
        "documento": "111111",
        "fecha_nacimiento": date(2012, 1, 1),
        "sexo": "M",
        "institucion": "Colegio A"
    }
    child_service.children_collection.insert_one(valid_doc)
    
    # Insertar un documento con datos faltantes
    invalid_doc = {
        "nombre": "María",
        # Falta apellido
        "documento": "222222"
        # Faltan otros campos requeridos
    }
    child_service.children_collection.insert_one(invalid_doc)
    
    children = child_service.get_all_children()
    # Debe devolver solo el documento válido
    assert len(children) == 1
    assert children[0].nombre == "Pedro"

def test_get_all_children_database_error():
    """Test error de base de datos al obtener niños"""
    with patch.object(child_service.children_collection, 'find', side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="Error al obtener la lista de niños"):
            child_service.get_all_children()

# ============= TESTS PARA GET_CHILD_BY_ID =============

def test_get_child_by_id_success(valid_child_data):
    """Test obtener niño por ID exitosamente"""
    child_id = child_service.create_child(valid_child_data)
    
    child = child_service.get_child_by_id(child_id)
    
    assert child is not None
    assert child.nombre == "Juan Carlos"
    assert child.apellido == "Pérez González"
    assert child.documento == "1234567890"
    assert child.consentimiento_informado is True

def test_get_child_by_id_not_found():
    """Test niño no encontrado por ID"""
    fake_id = str(ObjectId())
    child = child_service.get_child_by_id(fake_id)
    assert child is None

def test_get_child_by_id_invalid_id():
    """Test ID inválido"""
    invalid_id = "invalid_id_format"
    child = child_service.get_child_by_id(invalid_id)
    assert child is None

def test_get_child_by_id_database_error(valid_child_data):
    """Test error de base de datos al obtener niño por ID"""
    child_id = child_service.create_child(valid_child_data)
    
    with patch.object(child_service.children_collection, 'find_one', side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="Error al obtener el niño"):
            child_service.get_child_by_id(child_id)

# ============= TESTS PARA UPDATE_CHILD =============

def test_update_child_success(valid_child_data):
    """Test actualizar niño exitosamente"""
    child_id = child_service.create_child(valid_child_data)
    
    update_data = ChildUpdate(
        direccion="Nueva dirección 456",
        telefono_acudiente="3009999999",
        institucion="Nuevo Colegio"
    )
    
    result = child_service.update_child(child_id, update_data)
    assert result is True
    
    # Verificar cambios
    updated_child = child_service.get_child_by_id(child_id)
    assert updated_child.direccion == "Nueva dirección 456"
    assert updated_child.telefono_acudiente == "3009999999"
    assert updated_child.institucion == "Nuevo Colegio"

def test_update_child_single_field(valid_child_data):
    """Test actualizar un solo campo"""
    child_id = child_service.create_child(valid_child_data)
    
    update_data = ChildUpdate(barrio="Nuevo Barrio")
    result = child_service.update_child(child_id, update_data)
    
    assert result is True
    updated_child = child_service.get_child_by_id(child_id)
    assert updated_child.barrio == "Nuevo Barrio"

def test_update_child_not_found():
    """Test actualizar niño que no existe"""
    fake_id = str(ObjectId())
    update_data = ChildUpdate(nombre="Nuevo Nombre")
    
    result = child_service.update_child(fake_id, update_data)
    assert result is False

def test_update_child_invalid_id():
    """Test actualizar con ID inválido"""
    update_data = ChildUpdate(nombre="Nuevo Nombre")
    result = child_service.update_child("invalid_id", update_data)
    assert result is False

def test_update_child_empty_data(valid_child_data):
    """Test actualizar sin datos"""
    child_id = child_service.create_child(valid_child_data)
    update_data = ChildUpdate()  # Sin datos para actualizar
    
    result = child_service.update_child(child_id, update_data)
    assert result is False

def test_update_child_duplicate_document(valid_child_data, minimal_child_data):
    """Test actualizar con documento que ya existe"""
    child1_id = child_service.create_child(valid_child_data)
    child2_id = child_service.create_child(minimal_child_data)
    
    # Intentar actualizar child2 con el documento de child1
    update_data = ChildUpdate(
        tipo_documento="TI",
        documento="1234567890"  # Documento del child1
    )
    
    with pytest.raises(ValueError, match="Ya existe otro niño con este tipo y número de documento"):
        child_service.update_child(child2_id, update_data)

def test_update_child_document_update_same_child(valid_child_data):
    """Test actualizar documento del mismo niño (debería permitirse)"""
    child_id = child_service.create_child(valid_child_data)
    
    update_data = ChildUpdate(documento="9999999999")
    result = child_service.update_child(child_id, update_data)
    
    assert result is True

def test_update_child_database_error(valid_child_data):
    """Test error de base de datos al actualizar"""
    child_id = child_service.create_child(valid_child_data)
    update_data = ChildUpdate(nombre="Nuevo Nombre")
    
    with patch.object(child_service.children_collection, 'update_one', side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="Error al actualizar el niño"):
            child_service.update_child(child_id, update_data)

# ============= TESTS PARA DELETE_CHILD =============

def test_delete_child_success(valid_child_data):
    """Test eliminar niño exitosamente"""
    child_id = child_service.create_child(valid_child_data)
    
    # Agregar algunos datos relacionados
    obj_id = ObjectId(child_id)
    child_service.db["anthropometric_data"].insert_one({"child_id": obj_id, "weight": 25})
    child_service.db["behavioral_data"].insert_one({"child_id": obj_id, "behavior": "calm"})
    
    result = child_service.delete_child(child_id)
    assert result is True
    
    # Verificar que el niño fue eliminado
    deleted_child = child_service.get_child_by_id(child_id)
    assert deleted_child is None
    
    # Verificar que los datos relacionados fueron eliminados
    assert child_service.db["anthropometric_data"].find_one({"child_id": obj_id}) is None
    assert child_service.db["behavioral_data"].find_one({"child_id": obj_id}) is None

def test_delete_child_not_found():
    """Test eliminar niño que no existe"""
    fake_id = str(ObjectId())
    result = child_service.delete_child(fake_id)
    assert result is False

def test_delete_child_invalid_id():
    """Test eliminar con ID inválido"""
    result = child_service.delete_child("invalid_id")
    assert result is False

def test_delete_child_with_related_data_error(valid_child_data):
    """Test eliminar niño cuando hay error eliminando datos relacionados"""
    child_id = child_service.create_child(valid_child_data)
    
    # Mock error en eliminación de datos relacionados
    with patch.object(child_service.db["anthropometric_data"], 'delete_many', side_effect=Exception("Related data error")):
        result = child_service.delete_child(child_id)
        # Debería continuar y eliminar el niño principal
        assert result is True

def test_delete_child_database_error(valid_child_data):
    """Test error de base de datos al eliminar"""
    child_id = child_service.create_child(valid_child_data)
    
    with patch.object(child_service.children_collection, 'delete_one', side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="Error al eliminar el niño"):
            child_service.delete_child(child_id)

# ============= TESTS PARA SEARCH_CHILDREN =============

def test_search_children_by_nombre(valid_child_data, minimal_child_data):
    """Test buscar niños por nombre"""
    child_service.create_child(valid_child_data)
    child_service.create_child(minimal_child_data)
    
    # Búsqueda exacta
    results = child_service.search_children(nombre="Juan Carlos")
    assert len(results) == 1
    assert results[0].nombre == "Juan Carlos"
    
    # Búsqueda parcial
    results = child_service.search_children(nombre="Juan")
    assert len(results) == 1
    
    # Búsqueda case insensitive
    results = child_service.search_children(nombre="juan")
    assert len(results) == 1

def test_search_children_by_apellido(valid_child_data, minimal_child_data):
    """Test buscar niños por apellido"""
    child_service.create_child(valid_child_data)
    child_service.create_child(minimal_child_data)
    
    results = child_service.search_children(apellido="Pérez")
    assert len(results) == 1
    assert results[0].apellido == "Pérez González"

def test_search_children_by_documento(valid_child_data, minimal_child_data):
    """Test buscar niños por documento"""
    child_service.create_child(valid_child_data)
    child_service.create_child(minimal_child_data)
    
    results = child_service.search_children(documento="1234567890")
    assert len(results) == 1
    assert results[0].documento == "1234567890"

def test_search_children_by_institucion(valid_child_data):
    """Test buscar niños por institución"""
    child_service.create_child(valid_child_data)
    
    results = child_service.search_children(institucion="San José")
    assert len(results) == 1
    assert "San José" in results[0].institucion

def test_search_children_by_sexo(valid_child_data, minimal_child_data):
    """Test buscar niños por sexo"""
    child_service.create_child(valid_child_data)  # Masculino
    child_service.create_child(minimal_child_data)  # Femenino
    
    results = child_service.search_children(sexo="M")
    assert len(results) == 1
    assert results[0].sexo == SexoEnum.MASCULINO
    
    results = child_service.search_children(sexo="F")
    assert len(results) == 1
    assert results[0].sexo == SexoEnum.FEMENINO

def test_search_children_multiple_criteria(valid_child_data, minimal_child_data):
    """Test buscar niños con múltiples criterios"""
    child_service.create_child(valid_child_data)
    child_service.create_child(minimal_child_data)
    
    results = child_service.search_children(nombre="Juan", sexo="M")
    assert len(results) == 1
    assert results[0].nombre == "Juan Carlos"
    assert results[0].sexo == SexoEnum.MASCULINO

def test_search_children_no_results():
    """Test búsqueda sin resultados"""
    results = child_service.search_children(nombre="NoExiste")
    assert len(results) == 0

def test_search_children_with_corrupted_data(valid_child_data):
    """Test búsqueda con datos corruptos en la base"""
    child_service.create_child(valid_child_data)
    
    # Insertar documento corrupto
    child_service.children_collection.insert_one({
        "nombre": "Corrupto",
        # Faltan campos requeridos
    })
    
    results = child_service.search_children(nombre="Juan")
    assert len(results) == 1  # Solo el válido
    assert results[0].nombre == "Juan Carlos"

def test_search_children_database_error():
    """Test error de base de datos en búsqueda"""
    with patch.object(child_service.children_collection, 'find', side_effect=Exception("DB Error")):
        with pytest.raises(Exception, match="Error al buscar niños"):
            child_service.search_children(nombre="Juan")

# ============= TESTS ADICIONALES PARA COBERTURA =============

def test_logging_calls(valid_child_data, caplog):
    """Test que se ejecuten las llamadas de logging"""
    with caplog.at_level(logging.INFO):
        child_id = child_service.create_child(valid_child_data)
        assert f"Niño creado exitosamente con ID: {child_id}" in caplog.text
        
        child_service.get_child_by_id(child_id)
        
        children = child_service.get_all_children()
        assert f"Se obtuvieron {len(children)} niños" in caplog.text

def test_edge_cases_update_no_modified():
    """Test actualización que no modifica nada"""
    # Crear un niño
    child_data = ChildCreate(
        nombre="Test",
        apellido="Test",
        tipo_documento="TI",
        documento="123",
        fecha_nacimiento=date(2010, 1, 1),
        sexo=SexoEnum.MASCULINO,
        direccion="Test",
        nombre_acudiente="Test",
        telefono_acudiente="3001234567",
        consentimiento_informado=True
    )
    child_id = child_service.create_child(child_data)
    
    # Mock para simular que no se modificó nada
    with patch.object(child_service.children_collection, 'update_one') as mock_update:
        mock_result = MagicMock()
        mock_result.modified_count = 0
        mock_update.return_value = mock_result
        
        update_data = ChildUpdate(nombre="New Name")
        result = child_service.update_child(child_id, update_data)
        
        # Debería retornar False porque modified_count es 0
        assert result is False

# ============= TESTS DE INTEGRACIÓN =============

def test_full_crud_workflow():
    """Test completo de CRUD"""
    # CREATE
    child_data = ChildCreate(
        nombre="Integration",
        apellido="Test",
        tipo_documento="CC",
        documento="integration123",
        fecha_nacimiento=date(2012, 6, 15),
        sexo=SexoEnum.FEMENINO,
        direccion="Test Address",
        institucion="Test School",
        nombre_acudiente="Parent Test",
        telefono_acudiente="3001111111",
        consentimiento_informado=True
    )
    
    child_id = child_service.create_child(child_data)
    assert isinstance(child_id, str)
    
    # READ
    child = child_service.get_child_by_id(child_id)
    assert child.nombre == "Integration"
    
    # UPDATE
    update_data = ChildUpdate(institucion="Updated School")
    updated = child_service.update_child(child_id, update_data)
    assert updated is True
    
    updated_child = child_service.get_child_by_id(child_id)
    assert updated_child.institucion == "Updated School"
    
    # SEARCH
    search_results = child_service.search_children(nombre="Integration")
    assert len(search_results) == 1
    assert search_results[0].nombre == "Integration"
    
    # DELETE
    deleted = child_service.delete_child(child_id)
    assert deleted is True
    
    # Verify deletion
    deleted_child = child_service.get_child_by_id(child_id)
    assert deleted_child is None