import pytest
import mongomock
from backend.src.children.child_models import ChildCreate, ChildUpdate
import backend.src.children.child_service as child_service
from datetime import date

# Preparamos un mock de MongoDB antes de cada prueba
@pytest.fixture(autouse=True)
def mock_children_collection(monkeypatch):
    mock_db = mongomock.MongoClient().db
    monkeypatch.setattr(child_service, "children_collection", mock_db["ninos"])

def test_create_child():
    child = ChildCreate(
        nombre="Juan",
        apellido="Pérez",
        tipo_documento="TI",
        documento="123456",
        fecha_nacimiento=date(2010, 5, 10),
        sexo="M",
        direccion="Calle 123",
        institucion="Escuela A",
        barrio="Barrio B",
        nombre_acudiente="María Pérez",
        parentesco_acudiente="Madre",
        telefono_acudiente="3001234567",
        consentimiento_informado=True
    )

    child_id = child_service.create_child(child)
    assert isinstance(child_id, str)

def test_get_child_by_id():
    child = {
        "nombre": "Ana",
        "apellido": "López",
        "tipo_documento": "TI",
        "documento": "654321",
        "fecha_nacimiento": date(2011, 3, 15), 
        "sexo": "F",
        "direccion": "Calle 456",
        "nombre_acudiente": "Carlos López",
        "telefono_acudiente": "3007654321",
        "consentimiento_informado": True
    }
    result = child_service.children_collection.insert_one(child)
    child_id = str(result.inserted_id)

    fetched = child_service.get_child_by_id(child_id)
    assert fetched is not None
    assert fetched.nombre == "Ana"

def test_get_all_children():
    child_service.children_collection.insert_many([
        {"nombre": "Pedro", "apellido": "Sánchez", "tipo_documento": "TI", "documento": "111", "fecha_nacimiento": "2012-01-01", "sexo": "M", "direccion": "Calle 1", "nombre_acudiente": "Laura", "telefono_acudiente": "1111"},
        {"nombre": "Luisa", "apellido": "Martínez", "tipo_documento": "TI", "documento": "222", "fecha_nacimiento": "2013-02-02", "sexo": "F", "direccion": "Calle 2", "nombre_acudiente": "Pedro", "telefono_acudiente": "2222"}
    ])

    children = child_service.get_all_children()
    assert len(children) == 2
    assert children[0].nombre in ["Pedro", "Luisa"]

def test_update_child():
    child = {
        "nombre": "Sofía",
        "apellido": "Gómez",
        "tipo_documento": "TI",
        "documento": "777",
        "fecha_nacimiento": date(2012, 7, 7), 
        "sexo": "F",
        "direccion": "Calle Z",
        "nombre_acudiente": "Sandra",
        "telefono_acudiente": "9999"
    }
    result = child_service.children_collection.insert_one(child)
    child_id = str(result.inserted_id)

    update_data = ChildUpdate(direccion="Nueva dirección")
    updated = child_service.update_child(child_id, update_data)

    assert updated is True

def test_delete_child():
    child = {
        "nombre": "Mateo",
        "apellido": "Rodríguez",
        "tipo_documento": "TI",
        "documento": "888",
        "fecha_nacimiento": date(2011, 8, 8), 
        "sexo": "M",
        "direccion": "Calle W",
        "nombre_acudiente": "Lucía",
        "telefono_acudiente": "8888"
    }
    result = child_service.children_collection.insert_one(child)
    child_id = str(result.inserted_id)

    deleted = child_service.delete_child(child_id)
    assert deleted is True

    assert child_service.children_collection.find_one({"_id": result.inserted_id}) is None
