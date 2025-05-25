import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import patch, MagicMock
from bson import ObjectId
import json

import mongomock
from bson.errors import InvalidId
from pymongo.errors import DuplicateKeyError
from datetime import date, datetime
import backend.src.children.child_service as child_service
from backend.src.children.child_models import ChildCreate, ChildUpdate, SexoEnum
import logging

# Import the router and models
from backend.src.children.child_routes import child_router
from backend.src.children.child_models import ChildSummary, ChildInResponse

# ============= FIXTURES =============

@pytest.fixture
def app():
    """Create FastAPI app with child router"""
    app = FastAPI()
    app.include_router(child_router)
    return app

@pytest.fixture
def client(app):
    """Create test client"""
    return TestClient(app)

@pytest.fixture
def mock_child_summary():
    """Mock child summary data"""
    return ChildSummary(
        id=ObjectId(),
        nombre="Juan Carlos",
        apellido="Pérez González",
        documento="1234567890",
        fecha_nacimiento=date(2010, 5, 15),
        sexo=SexoEnum.MASCULINO,
        institucion="Colegio San José"
    )

@pytest.fixture
def mock_child_response():
    """Mock full child response data"""
    return ChildInResponse(
        id=ObjectId(),
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
def valid_child_create_data():
    """Valid data for creating a child"""
    return {
        "nombre": "Juan Carlos",
        "apellido": "Pérez González",
        "tipo_documento": "TI",
        "documento": "1234567890",
        "fecha_nacimiento": "2010-05-15",
        "sexo": "M",
        "direccion": "Calle 123 #45-67",
        "institucion": "Colegio San José",
        "barrio": "Centro",
        "nombre_acudiente": "María Elena González",
        "parentesco_acudiente": "Madre",
        "telefono_acudiente": "3001234567",
        "consentimiento_informado": True
    }

@pytest.fixture
def valid_child_update_data():
    """Valid data for updating a child"""
    return {
        "direccion": "Nueva dirección 456",
        "telefono_acudiente": "3009999999",
        "institucion": "Nuevo Colegio"
    }

# ============= TESTS FOR CREATE CHILD =============

@patch('backend.src.children.child_routes.create_child')
def test_create_new_child_success(mock_create, client, valid_child_create_data):
    """Test successful child creation"""
    mock_create.return_value = "507f1f77bcf86cd799439011"
    
    response = client.post("/children/", json=valid_child_create_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Niño registrado exitosamente"
    assert data["child_id"] == "507f1f77bcf86cd799439011"
    assert data["status"] == "success"
    mock_create.assert_called_once()

@patch('backend.src.children.child_routes.create_child')
def test_create_new_child_validation_error(mock_create, client):
    """Test child creation with validation error"""
    mock_create.side_effect = ValueError("Ya existe un niño registrado con este tipo y número de documento")
    
    invalid_data = {
        "nombre": "Juan",
        "apellido": "Pérez",
        "tipo_documento": "TI",
        "documento": "1234567890",
        "fecha_nacimiento": "2010-05-15",
        "sexo": "M",
        "direccion": "Calle 123",
        "nombre_acudiente": "María",
        "telefono_acudiente": "3001234567",
        "consentimiento_informado": True
    }
    
    response = client.post("/children/", json=invalid_data)
    
    assert response.status_code == 400
    assert "Ya existe un niño registrado con este tipo y número de documento" in response.json()["detail"]

@patch('backend.src.children.child_routes.create_child')
def test_create_new_child_internal_error(mock_create, client, valid_child_create_data):
    """Test child creation with internal server error"""
    mock_create.side_effect = Exception("Database connection failed")
    
    response = client.post("/children/", json=valid_child_create_data)
    
    assert response.status_code == 500
    assert "Error interno del servidor al crear el niño" in response.json()["detail"]

def test_create_new_child_invalid_json(client):
    """Test child creation with invalid JSON data"""
    invalid_data = {
        "nombre": "",  # Empty name should fail validation
        "apellido": "Pérez",
        "consentimiento_informado": False  # Should fail validation
    }
    
    response = client.post("/children/", json=invalid_data)
    assert response.status_code == 422  # Unprocessable Entity

# ============= TESTS FOR GET ALL CHILDREN =============

@patch('backend.src.children.child_routes.get_all_children')
def test_get_children_list_success(mock_get_all, client, mock_child_summary):
    """Test successful retrieval of children list"""
    mock_get_all.return_value = [mock_child_summary]
    
    response = client.get("/children/")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["nombre"] == "Juan Carlos"
    assert data[0]["apellido"] == "Pérez González"

@patch('backend.src.children.child_routes.get_all_children')
def test_get_children_list_empty(mock_get_all, client):
    """Test retrieval of empty children list"""
    mock_get_all.return_value = []
    
    response = client.get("/children/")
    
    assert response.status_code == 200
    assert response.json() == []

@patch('backend.src.children.child_routes.get_all_children')
def test_get_children_list_internal_error(mock_get_all, client):
    """Test children list retrieval with internal error"""
    mock_get_all.side_effect = Exception("Database error")
    
    response = client.get("/children/")
    
    assert response.status_code == 500
    assert "Error interno del servidor al obtener la lista de niños" in response.json()["detail"]

# ============= TESTS FOR SEARCH CHILDREN =============

@patch('backend.src.children.child_routes.search_children')
def test_search_children_by_name(mock_search, client, mock_child_summary):
    """Test search children by name"""
    mock_search.return_value = [mock_child_summary]
    
    response = client.get("/children/search?nombre=Juan")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["nombre"] == "Juan Carlos"
    mock_search.assert_called_once_with(
        nombre="Juan",
        apellido=None,
        documento=None,
        institucion=None,
        sexo=None
    )

@patch('backend.src.children.child_routes.search_children')
def test_search_children_multiple_criteria(mock_search, client, mock_child_summary):
    """Test search children with multiple criteria"""
    mock_search.return_value = [mock_child_summary]
    
    response = client.get("/children/search?nombre=Juan&sexo=M&institucion=Colegio")
    
    assert response.status_code == 200
    mock_search.assert_called_once_with(
        nombre="Juan",
        apellido=None,
        documento=None,
        institucion="Colegio",
        sexo="M"
    )

def test_search_children_no_criteria(client):
    """Test search children without criteria"""
    response = client.get("/children/search")
    
    assert response.status_code == 400
    assert "Debe proporcionar al menos un criterio de búsqueda" in response.json()["detail"]

@patch('backend.src.children.child_routes.search_children')
def test_search_children_internal_error(mock_search, client):
    """Test search children with internal error"""
    mock_search.side_effect = Exception("Search error")
    
    response = client.get("/children/search?nombre=Juan")
    
    assert response.status_code == 500
    assert "Error interno del servidor al buscar niños" in response.json()["detail"]

# ============= TESTS FOR GET CHILD BY ID =============

@patch('backend.src.children.child_routes.get_child_by_id')
def test_get_child_details_success(mock_get_child, client, mock_child_response):
    """Test successful retrieval of child details"""
    child_id = "507f1f77bcf86cd799439011"
    mock_get_child.return_value = mock_child_response
    
    response = client.get(f"/children/{child_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Juan Carlos"
    assert data["documento"] == "1234567890"
    mock_get_child.assert_called_once_with(child_id)

@patch('backend.src.children.child_routes.get_child_by_id')
def test_get_child_details_not_found(mock_get_child, client):
    """Test child not found"""
    child_id = "507f1f77bcf86cd799439011"
    mock_get_child.return_value = None
    
    response = client.get(f"/children/{child_id}")
    
    assert response.status_code == 404
    assert f"No se encontró ningún niño con ID: {child_id}" in response.json()["detail"]

@patch('backend.src.children.child_routes.get_child_by_id')
def test_get_child_details_internal_error(mock_get_child, client):
    """Test get child details with internal error"""
    child_id = "507f1f77bcf86cd799439011"
    mock_get_child.side_effect = Exception("Database error")
    
    response = client.get(f"/children/{child_id}")
    
    assert response.status_code == 500
    assert "Error interno del servidor al obtener el niño" in response.json()["detail"]

# ============= TESTS FOR UPDATE CHILD =============

@patch('backend.src.children.child_routes.update_child')
def test_update_child_data_success(mock_update, client, valid_child_update_data):
    """Test successful child update"""
    child_id = "507f1f77bcf86cd799439011"
    mock_update.return_value = True
    
    response = client.put(f"/children/{child_id}", json=valid_child_update_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Niño actualizado exitosamente"
    assert data["child_id"] == child_id
    assert "direccion" in data["updated_fields"]
    assert data["status"] == "success"

@patch('backend.src.children.child_routes.update_child')
def test_update_child_data_not_found(mock_update, client, valid_child_update_data):
    """Test update child not found"""
    child_id = "507f1f77bcf86cd799439011"
    mock_update.return_value = False
    
    response = client.put(f"/children/{child_id}", json=valid_child_update_data)
    
    assert response.status_code == 404
    assert f"No se encontró ningún niño con ID: {child_id}" in response.json()["detail"]

def test_update_child_data_no_fields(client):
    """Test update child with no fields provided"""
    child_id = "507f1f77bcf86cd799439011"
    
    response = client.put(f"/children/{child_id}", json={})
    
    assert response.status_code == 400
    assert "No se proporcionaron campos para actualizar" in response.json()["detail"]

@patch('backend.src.children.child_routes.update_child')
def test_update_child_data_validation_error(mock_update, client):
    """Test update child with validation error"""
    child_id = "507f1f77bcf86cd799439011"
    mock_update.side_effect = ValueError("Ya existe otro niño con este tipo y número de documento")
    
    update_data = {"documento": "1234567890"}
    response = client.put(f"/children/{child_id}", json=update_data)
    
    assert response.status_code == 400
    assert "Ya existe otro niño con este tipo y número de documento" in response.json()["detail"]

@patch('backend.src.children.child_routes.update_child')
def test_update_child_data_internal_error(mock_update, client, valid_child_update_data):
    """Test update child with internal error"""
    child_id = "507f1f77bcf86cd799439011"
    mock_update.side_effect = Exception("Database error")
    
    response = client.put(f"/children/{child_id}", json=valid_child_update_data)
    
    assert response.status_code == 500
    assert "Error interno del servidor al actualizar el niño" in response.json()["detail"]

# ============= TESTS FOR DELETE CHILD =============

@patch('backend.src.children.child_routes.delete_child')
def test_delete_child_record_success(mock_delete, client):
    """Test successful child deletion"""
    child_id = "507f1f77bcf86cd799439011"
    mock_delete.return_value = True
    
    response = client.delete(f"/children/{child_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Niño y todos sus datos relacionados eliminados exitosamente"
    assert data["child_id"] == child_id
    assert data["status"] == "success"

@patch('backend.src.children.child_routes.delete_child')
def test_delete_child_record_not_found(mock_delete, client):
    """Test delete child not found"""
    child_id = "507f1f77bcf86cd799439011"
    mock_delete.return_value = False
    
    response = client.delete(f"/children/{child_id}")
    
    assert response.status_code == 404
    assert f"No se encontró ningún niño con ID: {child_id}" in response.json()["detail"]

@patch('backend.src.children.child_routes.delete_child')
def test_delete_child_record_internal_error(mock_delete, client):
    """Test delete child with internal error"""
    child_id = "507f1f77bcf86cd799439011"
    mock_delete.side_effect = Exception("Database error")
    
    response = client.delete(f"/children/{child_id}")
    
    assert response.status_code == 500
    assert "Error interno del servidor al eliminar el niño" in response.json()["detail"]

# ============= TESTS FOR HEALTH CHECK =============

@patch('backend.src.children.child_routes.get_all_children')
def test_children_health_check_healthy(mock_get_all, client, mock_child_summary):
    """Test health check when service is healthy"""
    mock_get_all.return_value = [mock_child_summary, mock_child_summary]
    
    response = client.get("/children/health/check")
    
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "children"
    assert data["status"] == "healthy"
    assert data["total_children"] == 2
    assert "timestamp" in data

@patch('backend.src.children.child_routes.get_all_children')
def test_children_health_check_unhealthy(mock_get_all, client):
    """Test health check when service is unhealthy"""
    mock_get_all.side_effect = Exception("Database connection failed")
    
    response = client.get("/children/health/check")
    
    assert response.status_code == 503
    data = response.json()
    assert data["service"] == "children"
    assert data["status"] == "unhealthy"
    assert data["error"] == "Database connection failed"
    assert "timestamp" in data

# ============= INTEGRATION TESTS =============

def test_full_api_workflow_mocked(client):
    """Test complete API workflow with mocked services"""
    child_id = "507f1f77bcf86cd799439011"
    
    # Test CREATE
    with patch('backend.src.children.child_routes.create_child') as mock_create:
        mock_create.return_value = child_id
        
        create_data = {
            "nombre": "Integration",
            "apellido": "Test",
            "tipo_documento": "CC",
            "documento": "integration123",
            "fecha_nacimiento": "2012-06-15",
            "sexo": "F",
            "direccion": "Test Address",
            "institucion": "Test School",
            "nombre_acudiente": "Parent Test",
            "telefono_acudiente": "3001111111",
            "consentimiento_informado": True
        }
        
        response = client.post("/children/", json=create_data)
        assert response.status_code == 201
        assert response.json()["child_id"] == child_id
    
    # Test GET by ID
    with patch('backend.src.children.child_routes.get_child_by_id') as mock_get:
        mock_child = ChildInResponse(
            id=ObjectId(child_id),
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
        mock_get.return_value = mock_child
        
        response = client.get(f"/children/{child_id}")
        assert response.status_code == 200
        assert response.json()["nombre"] == "Integration"
    
    # Test UPDATE
    with patch('backend.src.children.child_routes.update_child') as mock_update:
        mock_update.return_value = True
        
        update_data = {"institucion": "Updated School"}
        response = client.put(f"/children/{child_id}", json=update_data)
        assert response.status_code == 200
        assert "institucion" in response.json()["updated_fields"]
    
    # Test SEARCH
    with patch('backend.src.children.child_routes.search_children') as mock_search:
        mock_summary = ChildSummary(
            id=ObjectId(child_id),
            nombre="Integration",
            apellido="Test",
            documento="integration123",
            fecha_nacimiento=date(2012, 6, 15),
            sexo=SexoEnum.FEMENINO,
            institucion="Updated School"
        )
        mock_search.return_value = [mock_summary]
        
        response = client.get("/children/search?nombre=Integration")
        assert response.status_code == 200
        assert len(response.json()) == 1
    
    # Test DELETE
    with patch('backend.src.children.child_routes.delete_child') as mock_delete:
        mock_delete.return_value = True
        
        response = client.delete(f"/children/{child_id}")
        assert response.status_code == 200
        assert response.json()["status"] == "success"

# ============= EDGE CASES AND ERROR HANDLING =============

def test_invalid_child_id_format(client):
    """Test with invalid child ID format"""
    invalid_id = "invalid-id-format"
    
    # Test GET with invalid ID
    with patch('backend.src.children.child_routes.get_child_by_id') as mock_get:
        mock_get.return_value = None
        response = client.get(f"/children/{invalid_id}")
        assert response.status_code == 404
    
    # Test UPDATE with invalid ID
    with patch('backend.src.children.child_routes.update_child') as mock_update:
        mock_update.return_value = False
        response = client.put(f"/children/{invalid_id}", json={"nombre": "Test"})
        assert response.status_code == 404
    
    # Test DELETE with invalid ID
    with patch('backend.src.children.child_routes.delete_child') as mock_delete:
        mock_delete.return_value = False
        response = client.delete(f"/children/{invalid_id}")
        assert response.status_code == 404

def test_malformed_json_requests(client):
    """Test with malformed JSON requests"""
    child_id = "507f1f77bcf86cd799439011"
    
    # Test CREATE with malformed JSON
    response = client.post(
        "/children/",
        data="{'invalid': json}",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422
    
    # Test UPDATE with malformed JSON
    response = client.put(
        f"/children/{child_id}",
        data="{'invalid': json}",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422

def test_search_with_empty_strings(client):
    """Test search with empty string parameters"""
    # Empty strings should be treated as None
    response = client.get("/children/search?nombre=&apellido=")
    assert response.status_code == 400  # No valid criteria provided

@patch('backend.src.children.child_routes.search_children')
def test_search_with_special_characters(mock_search, client, mock_child_summary):
    """Test search with special characters"""
    mock_search.return_value = [mock_child_summary]
    
    # Test with special characters in search
    response = client.get("/children/search?nombre=José María")
    assert response.status_code == 200
    
    mock_search.assert_called_once_with(
        nombre="José María",
        apellido=None,
        documento=None,
        institucion=None,
        sexo=None
    )

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
    assert "institucion" not in saved_child or saved_child["institucion"] is None
    assert "barrio" not in saved_child or saved_child["barrio"] is None
    assert "parentesco_acudiente" not in saved_child or saved_child["parentesco_acudiente"] is None

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
    # Usar la función helper para preparar los datos correctamente
    valid_doc = {
        "nombre": "Pedro",
        "apellido": "Sánchez",
        "documento": "111111",
        "fecha_nacimiento": date(2012, 1, 1),
        "sexo": "M",
        "institucion": "Colegio A"
    }
    # Preparar datos usando la función del servicio
    prepared_doc = child_service._prepare_child_data_for_db(valid_doc.copy())
    child_service.children_collection.insert_one(prepared_doc)
    
    # Insertar documento corrupto directamente
    corrupted_doc = {
        "nombre": "Ana",
        "apellido": "López",
        "documento": "222222", 
        "fecha_nacimiento": "fecha-inválida",  # Dato corrupto
        "sexo": "F",
        "institucion": "Colegio B"
    }
    child_service.children_collection.insert_one(corrupted_doc)
    
    # El servicio debería manejar el documento corrupto gracefully
    children = child_service.get_all_children()
    
    # Debería devolver solo el documento válido
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
    child_service.db["datos_antropometricos"].insert_one({"child_id": obj_id, "weight": 25})
    child_service.db["datos_conductuales"].insert_one({"child_id": obj_id, "behavior": "calm"})
    
    result = child_service.delete_child(child_id)
    assert result is True
    
    # Verificar que el niño fue eliminado
    deleted_child = child_service.get_child_by_id(child_id)
    assert deleted_child is None
    
    # Verificar que los datos relacionados fueron eliminados
    assert child_service.db["datos_antropometricos"].find_one({"child_id": obj_id}) is None
    assert child_service.db["datos_conductuales"].find_one({"child_id": obj_id}) is None

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
    with patch.object(child_service.db["datos_antropometricos"], 'delete_many', side_effect=Exception("Related data error")):
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