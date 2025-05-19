import sys
import os
import pytest
from fastapi.testclient import TestClient

# Agrega la raíz del proyecto al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

@pytest.fixture(scope="module")
def test_client():
    client = TestClient(app)
    yield client
