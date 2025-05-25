import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import patch, MagicMock
from datetime import date
from bson import ObjectId
import json

# Import the router and models
from backend.src.children.child_routes import child_router
from backend.src.children.child_models import ChildSummary, ChildInResponse, SexoEnum

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