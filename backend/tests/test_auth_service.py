import pytest
from httpx import AsyncClient
from fastapi import status
from main import app  # Asegúrate de que este sea el archivo correcto donde está tu app
from db.database import db

usuarios_collection = db["usuarios"]

@pytest.fixture(scope="module", autouse=True)
def setup_test_user():
    # Limpia antes y después del test
    usuarios_collection.delete_many({"email": "testuser@example.com"})
    yield
    usuarios_collection.delete_many({"email": "testuser@example.com"})

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        response = await client.post("/auth/register", json={
            "email": "testuser@example.com",
            "password": "TestPassword123"
        })
        assert response.status_code == status.HTTP_200_OK
        assert "user_id" in response.json()

@pytest.mark.asyncio
async def test_register_existing_user():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        # Intenta registrar el mismo usuario otra vez
        response = await client.post("/auth/register", json={
            "email": "testuser@example.com",
            "password": "TestPassword123"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["detail"] == "User already exists"

@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        response = await client.post("/auth/login", data={
            "username": "testuser@example.com",
            "password": "TestPassword123"
        })
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_password():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        response = await client.post("/auth/login", data={
            "username": "testuser@example.com",
            "password": "WrongPassword"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json()["detail"] == "Invalid credentials"

@pytest.mark.asyncio
async def test_refresh_token():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        # Login primero para obtener refresh token
        login_resp = await client.post("/auth/login", data={
            "username": "testuser@example.com",
            "password": "TestPassword123"
        })
        refresh_token = login_resp.json()["refresh_token"]

        # Usar el refresh token
        response = await client.post("/auth/refresh", json={
            "refresh_token": refresh_token
        })
        assert response.status_code == status.HTTP_200_OK
        assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_me_with_valid_token():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        login_resp = await client.post("/auth/login", data={
            "username": "testuser@example.com",
            "password": "TestPassword123"
        })
        access_token = login_resp.json()["access_token"]

        response = await client.get("/auth/me", headers={
            "Authorization": f"Bearer {access_token}"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["email"] == "testuser@example.com"

@pytest.mark.asyncio
async def test_me_with_invalid_token():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        response = await client.get("/auth/me", headers={
            "Authorization": "Bearer invalidtoken"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json()["detail"] == "Invalid token"
