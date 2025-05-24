import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from fastapi import status
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone, timedelta
import jwt
import os

# Importaciones del proyecto
from main import app 
from db.database import db
from backend.src.auth.auth_utils import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    verify_access_token,
    verify_refresh_token,
    create_password_reset_token,
    verify_password_reset_token,
    get_access_token_expire_seconds
)
from backend.src.auth import auth_service
from backend.src.auth.auth_models import UserRegister, UserLogin, PasswordChange, PasswordReset

# Colecciones de la base de datos
users_collection = db["usuarios"]
roles_collection = db["roles"]
audit_log_collection = db["audit_log"]

class TestAuthUtils:
    """Tests para auth_utils.py"""
    
    def test_hash_password(self):
        """Test hash de contraseña"""
        password = "TestPassword123"
        hashed = hash_password(password)
        assert hashed != password
        assert len(hashed) > 20  # bcrypt genera hashes largos
        
    def test_verify_password_success(self):
        """Test verificación exitosa de contraseña"""
        password = "TestPassword123"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True
        
    def test_verify_password_failure(self):
        """Test verificación fallida de contraseña"""
        password = "TestPassword123"
        wrong_password = "WrongPassword123"
        hashed = hash_password(password)
        assert verify_password(wrong_password, hashed) is False
        
    def test_create_access_token(self):
        """Test creación de access token"""
        user_id = "507f1f77bcf86cd799439011"
        role = "usuario"
        token = create_access_token(user_id, role)
        assert isinstance(token, str)
        assert len(token) > 50
        
    def test_create_refresh_token(self):
        """Test creación de refresh token"""
        user_id = "507f1f77bcf86cd799439011"
        token = create_refresh_token(user_id)
        assert isinstance(token, str)
        assert len(token) > 50
        
    def test_verify_access_token_valid(self):
        """Test verificación de access token válido"""
        user_id = "507f1f77bcf86cd799439011"
        role = "usuario"
        token = create_access_token(user_id, role)
        payload = verify_access_token(token)
        assert payload is not None
        assert payload["sub"] == user_id
        assert payload["role"] == role
        assert payload["type"] == "access"
        
    def test_verify_access_token_invalid(self):
        """Test verificación de access token inválido"""
        invalid_token = "invalid.token.here"
        payload = verify_access_token(invalid_token)
        assert payload is None
        
    def test_verify_refresh_token_valid(self):
        """Test verificación de refresh token válido"""
        user_id = "507f1f77bcf86cd799439011"
        token = create_refresh_token(user_id)
        extracted_user_id = verify_refresh_token(token)
        assert extracted_user_id == user_id
        
    def test_verify_refresh_token_invalid(self):
        """Test verificación de refresh token inválido"""
        invalid_token = "invalid.token.here"
        user_id = verify_refresh_token(invalid_token)
        assert user_id is None
        
    def test_create_password_reset_token(self):
        """Test creación de token de reset de contraseña"""
        user_id = "507f1f77bcf86cd799439011"
        token = create_password_reset_token(user_id)
        assert isinstance(token, str)
        assert len(token) > 50
        
    def test_verify_password_reset_token_valid(self):
        """Test verificación de token de reset válido"""
        user_id = "507f1f77bcf86cd799439011"
        token = create_password_reset_token(user_id)
        extracted_user_id = verify_password_reset_token(token)
        assert extracted_user_id == user_id
        
    def test_get_access_token_expire_seconds(self):
        """Test obtención de segundos de expiración"""
        seconds = get_access_token_expire_seconds()
        assert isinstance(seconds, int)
        assert seconds > 0


class TestAuthModels:
    """Tests para auth_models.py"""
    
    def test_user_register_valid(self):
        """Test modelo UserRegister válido"""
        user_data = {
            "email": "test@example.com",
            "password": "TestPass123",
            "role_name": "usuario"
        }
        user = UserRegister(**user_data)
        assert user.email == "test@example.com"
        assert user.password == "TestPass123"
        assert user.role_name == "usuario"
        
    def test_user_register_invalid_password(self):
        """Test modelo UserRegister con contraseña inválida"""
        with pytest.raises(ValueError, match="debe tener al menos 8 caracteres"):
            UserRegister(email="test@example.com", password="123")
            
        with pytest.raises(ValueError, match="debe tener al menos una mayúscula"):
            UserRegister(email="test@example.com", password="testpass123")
            
        with pytest.raises(ValueError, match="debe tener al menos una minúscula"):
            UserRegister(email="test@example.com", password="TESTPASS123")
            
        with pytest.raises(ValueError, match="debe tener al menos un número"):
            UserRegister(email="test@example.com", password="TestPassword")
            
    def test_user_register_invalid_role(self):
        """Test modelo UserRegister con rol inválido"""
        with pytest.raises(ValueError, match="Rol debe ser uno de"):
            UserRegister(email="test@example.com", password="TestPass123", role_name="invalid_role")
            
    def test_password_change_valid(self):
        """Test modelo PasswordChange válido"""
        password_data = {
            "current_password": "OldPass123",
            "new_password": "NewPass123"
        }
        password_change = PasswordChange(**password_data)
        assert password_change.current_password == "OldPass123"
        assert password_change.new_password == "NewPass123"


@pytest.fixture(scope="function", autouse=True)
def setup_and_cleanup():
    """Limpiar base de datos antes y después de cada test"""
    # Limpiar antes
    users_collection.delete_many({"email": {"$regex": "test.*@example.com"}})
    roles_collection.delete_many({"name": {"$in": ["admin", "usuario", "doctor"]}})
    audit_log_collection.delete_many({})
    
    # Crear roles por defecto para tests
    default_roles = ['admin', 'doctor', 'enfermero', 'investigador', 'usuario']
    for role_name in default_roles:
        if not roles_collection.find_one({"name": role_name}):
            roles_collection.insert_one({
                "name": role_name,
                "created_at": datetime.now(timezone.utc)
            })
    
    yield
    
    # Limpiar después
    users_collection.delete_many({"email": {"$regex": "test.*@example.com"}})
    audit_log_collection.delete_many({})


class TestAuthService:
    """Tests para auth_service.py"""
    
    def test_register_user_success(self):
        """Test registro exitoso de usuario"""
        result = auth_service.register_user(
            email="test1@example.com",
            password="TestPass123",
            role_name="usuario"
        )
        assert "error" not in result
        assert "message" in result
        assert "user_id" in result
        assert result["message"] == "Usuario registrado exitosamente"
        
    def test_register_user_duplicate_email(self):
        """Test registro con email duplicado"""
        # Registrar primer usuario
        auth_service.register_user("test2@example.com", "TestPass123", "usuario")
        
        # Intentar registrar con el mismo email
        result = auth_service.register_user("test2@example.com", "TestPass123", "usuario")
        assert "error" in result
        assert "ya está registrado" in result["error"]
        
    def test_register_user_invalid_role(self):
        """Test registro con rol inválido"""
        result = auth_service.register_user(
            email="test3@example.com",
            password="TestPass123",
            role_name="invalid_role"
        )
        assert "error" in result
        assert "no encontrado" in result["error"]
        
    def test_authenticate_user_success(self):
        """Test autenticación exitosa"""
        # Registrar usuario primero
        auth_service.register_user("test4@example.com", "TestPass123", "usuario")
        
        # Autenticar
        result = auth_service.authenticate_user("test4@example.com", "TestPass123")
        assert result is not None
        assert "access_token" in result
        assert "refresh_token" in result
        assert result["token_type"] == "bearer"
        
    def test_authenticate_user_wrong_password(self):
        """Test autenticación con contraseña incorrecta"""
        # Registrar usuario primero
        auth_service.register_user("test5@example.com", "TestPass123", "usuario")
        
        # Autenticar con contraseña incorrecta
        result = auth_service.authenticate_user("test5@example.com", "WrongPass123")
        assert result is None
        
    def test_authenticate_user_nonexistent(self):
        """Test autenticación con usuario inexistente"""
        result = auth_service.authenticate_user("nonexistent@example.com", "TestPass123")
        assert result is None
        
    def test_get_user_by_email(self):
        """Test obtener usuario por email"""
        # Registrar usuario primero
        auth_service.register_user("test6@example.com", "TestPass123", "usuario")
        
        # Obtener usuario
        user = auth_service.get_user_by_email("test6@example.com")
        assert user is not None
        assert user["email"] == "test6@example.com"
        
    def test_get_user_by_id(self):
        """Test obtener usuario por ID"""
        # Registrar usuario primero
        result = auth_service.register_user("test7@example.com", "TestPass123", "usuario")
        user_id = result["user_id"]
        
        # Obtener usuario por ID
        user = auth_service.get_user_by_id(user_id)
        assert user is not None
        assert str(user["_id"]) == user_id
        
    def test_get_current_user(self):
        """Test obtener usuario actual"""
        # Registrar usuario primero
        result = auth_service.register_user("test8@example.com", "TestPass123", "usuario")
        user_id = result["user_id"]
        
        # Obtener usuario actual
        user_out = auth_service.get_current_user(user_id)
        assert user_out is not None
        assert user_out.email == "test8@example.com"
        assert user_out.role_name == "usuario"
        
    def test_change_password_success(self):
        """Test cambio exitoso de contraseña"""
        # Registrar usuario
        result = auth_service.register_user("test9@example.com", "TestPass123", "usuario")
        user_id = result["user_id"]
        
        # Cambiar contraseña
        success = auth_service.change_password(
            user_id=user_id,
            current_password="TestPass123",
            new_password="NewPass123"
        )
        assert success is True
        
        # Verificar que la nueva contraseña funciona
        auth_result = auth_service.authenticate_user("test9@example.com", "NewPass123")
        assert auth_result is not None
        
    def test_change_password_wrong_current(self):
        """Test cambio de contraseña con contraseña actual incorrecta"""
        # Registrar usuario
        result = auth_service.register_user("test10@example.com", "TestPass123", "usuario")
        user_id = result["user_id"]
        
        # Intentar cambiar con contraseña actual incorrecta
        success = auth_service.change_password(
            user_id=user_id,
            current_password="WrongPass123",
            new_password="NewPass123"
        )
        assert success is False
        
    def test_refresh_access_token_success(self):
        """Test renovación exitosa de token"""
        # Registrar y autenticar usuario
        auth_service.register_user("test11@example.com", "TestPass123", "usuario")
        auth_result = auth_service.authenticate_user("test11@example.com", "TestPass123")
        refresh_token = auth_result["refresh_token"]
        
        # Renovar token
        new_token_result = auth_service.refresh_access_token(refresh_token)
        assert new_token_result is not None
        assert "access_token" in new_token_result
        
    def test_refresh_access_token_invalid(self):
        """Test renovación con token inválido"""
        result = auth_service.refresh_access_token("invalid_token")
        assert result is None
        
    def test_request_password_reset(self):
        """Test solicitud de reset de contraseña"""
        # Registrar usuario
        auth_service.register_user("test12@example.com", "TestPass123", "usuario")
        
        # Solicitar reset
        token = auth_service.request_password_reset("test12@example.com")
        assert token is not None
        assert isinstance(token, str)
        
    def test_request_password_reset_nonexistent(self):
        """Test solicitud de reset para email inexistente"""
        token = auth_service.request_password_reset("nonexistent@example.com")
        assert token is None
        
    def test_reset_password_success(self):
        """Test reset exitoso de contraseña"""
        # Registrar usuario
        auth_service.register_user("test13@example.com", "TestPass123", "usuario")
        
        # Solicitar reset
        reset_token = auth_service.request_password_reset("test13@example.com")
        
        # Resetear contraseña
        success = auth_service.reset_password(reset_token, "NewPass123")
        assert success is True
        
        # Verificar que la nueva contraseña funciona
        auth_result = auth_service.authenticate_user("test13@example.com", "NewPass123")
        assert auth_result is not None
        
    def test_reset_password_invalid_token(self):
        """Test reset con token inválido"""
        success = auth_service.reset_password("invalid_token", "NewPass123")
        assert success is False
        
    def test_get_all_users(self):
        """Test obtener todos los usuarios"""
        # Registrar algunos usuarios
        auth_service.register_user("test14@example.com", "TestPass123", "usuario")
        auth_service.register_user("test15@example.com", "TestPass123", "admin")
        
        # Obtener todos los usuarios
        users = auth_service.get_all_users()
        assert len(users) >= 2
        assert all(hasattr(user, 'email') for user in users)
        
    def test_failed_login_attempts_lockout(self):
        """Test bloqueo por intentos fallidos"""
        # Registrar usuario
        auth_service.register_user("test16@example.com", "TestPass123", "usuario")
        
        # Realizar 5 intentos fallidos
        for _ in range(5):
            result = auth_service.authenticate_user("test16@example.com", "WrongPass")
            assert result is None
            
        # Verificar que la cuenta está bloqueada
        user = auth_service.get_user_by_email("test16@example.com")
        assert user.get("locked_until") is not None
        assert user.get("locked_until") > datetime.now(timezone.utc)


class TestAuthRoutes:
    """Tests para auth_routes.py (endpoints)"""
    
    @pytest.mark.asyncio
    async def test_register_endpoint_success(self):
        """Test endpoint de registro exitoso"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            response = await client.post("/auth/register", json={
                "email": "test17@example.com",
                "password": "TestPass123",
                "role_name": "usuario"
            })
            assert response.status_code == status.HTTP_201_CREATED
            data = response.json()
            assert "message" in data
            assert "user_id" in data
            
    @pytest.mark.asyncio
    async def test_register_endpoint_duplicate(self):
        """Test endpoint de registro con email duplicado"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Primer registro
            await client.post("/auth/register", json={
                "email": "test18@example.com",
                "password": "TestPass123"
            })
            
            # Segundo registro con mismo email
            response = await client.post("/auth/register", json={
                "email": "test18@example.com",
                "password": "TestPass123"
            })
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            
    @pytest.mark.asyncio
    async def test_register_endpoint_invalid_password(self):
        """Test endpoint de registro con contraseña inválida"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            response = await client.post("/auth/register", json={
                "email": "test19@example.com",
                "password": "123"  # Muy corta
            })
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
            
    @pytest.mark.asyncio
    async def test_login_endpoint_success(self):
        """Test endpoint de login exitoso"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar usuario primero
            await client.post("/auth/register", json={
                "email": "test20@example.com",
                "password": "TestPass123"
            })
            
            # Login
            response = await client.post("/auth/login", data={
                "username": "test20@example.com",
                "password": "TestPass123"
            })
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert "access_token" in data
            assert "refresh_token" in data
            assert data["token_type"] == "bearer"
            
    @pytest.mark.asyncio
    async def test_login_json_endpoint_success(self):
        """Test endpoint de login JSON exitoso"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar usuario primero
            await client.post("/auth/register", json={
                "email": "test21@example.com",
                "password": "TestPass123"
            })
            
            # Login JSON
            response = await client.post("/auth/login-json", json={
                "email": "test21@example.com",
                "password": "TestPass123"
            })
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert "access_token" in data
            
    @pytest.mark.asyncio
    async def test_login_endpoint_invalid_credentials(self):
        """Test endpoint de login con credenciales inválidas"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            response = await client.post("/auth/login", data={
                "username": "nonexistent@example.com",
                "password": "TestPass123"
            })
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            
    @pytest.mark.asyncio
    async def test_me_endpoint_success(self):
        """Test endpoint /me con token válido"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar y hacer login
            await client.post("/auth/register", json={
                "email": "test22@example.com",
                "password": "TestPass123"
            })
            
            login_response = await client.post("/auth/login", data={
                "username": "test22@example.com",
                "password": "TestPass123"
            })
            token = login_response.json()["access_token"]
            
            # Obtener perfil
            response = await client.get("/auth/me", headers={
                "Authorization": f"Bearer {token}"
            })
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["email"] == "test22@example.com"
            assert "role_name" in data
            
    @pytest.mark.asyncio
    async def test_me_endpoint_invalid_token(self):
        """Test endpoint /me con token inválido"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            response = await client.get("/auth/me", headers={
                "Authorization": "Bearer invalid_token"
            })
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            
    @pytest.mark.asyncio
    async def test_change_password_endpoint_success(self):
        """Test endpoint de cambio de contraseña exitoso"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar y hacer login
            await client.post("/auth/register", json={
                "email": "test23@example.com",
                "password": "TestPass123"
            })
            
            login_response = await client.post("/auth/login", data={
                "username": "test23@example.com",
                "password": "TestPass123"
            })
            token = login_response.json()["access_token"]
            
            # Cambiar contraseña
            response = await client.post("/auth/change-password", 
                json={
                    "current_password": "TestPass123",
                    "new_password": "NewPass123"
                },
                headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == status.HTTP_200_OK
            assert "exitosamente" in response.json()["message"]
            
    @pytest.mark.asyncio
    async def test_refresh_token_endpoint_success(self):
        """Test endpoint de refresh token exitoso"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar y hacer login
            await client.post("/auth/register", json={
                "email": "test24@example.com",
                "password": "TestPass123"
            })
            
            login_response = await client.post("/auth/login", data={
                "username": "test24@example.com",
                "password": "TestPass123"
            })
            refresh_token = login_response.json()["refresh_token"]
            
            # Renovar token
            response = await client.post("/auth/refresh", json={
                "refresh_token": refresh_token
            })
            assert response.status_code == status.HTTP_200_OK
            assert "access_token" in response.json()
            
    @pytest.mark.asyncio
    async def test_password_reset_request_endpoint(self):
        """Test endpoint de solicitud de reset de contraseña"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar usuario
            await client.post("/auth/register", json={
                "email": "test25@example.com",
                "password": "TestPass123"
            })
            
            # Solicitar reset
            response = await client.post("/auth/password-reset", json={
                "email": "test25@example.com"
            })
            assert response.status_code == status.HTTP_200_OK
            assert "message" in response.json()
            
    @pytest.mark.asyncio
    async def test_verify_token_endpoint_success(self):
        """Test endpoint de verificación de token exitoso"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar y hacer login
            await client.post("/auth/register", json={
                "email": "test26@example.com",
                "password": "TestPass123"
            })
            
            login_response = await client.post("/auth/login", data={
                "username": "test26@example.com",
                "password": "TestPass123"
            })
            token = login_response.json()["access_token"]
            
            # Verificar token
            response = await client.get("/auth/verify-token", headers={
                "Authorization": f"Bearer {token}"
            })
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["message"] == "Token válido"
            assert "user_id" in data
            
    @pytest.mark.asyncio
    async def test_admin_get_users_endpoint(self):
        """Test endpoint administrativo para obtener usuarios"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar admin
            await client.post("/auth/register", json={
                "email": "admin@example.com",
                "password": "AdminPass123",
                "role_name": "admin"
            })
            
            # Login como admin
            login_response = await client.post("/auth/login", data={
                "username": "admin@example.com",
                "password": "AdminPass123"
            })
            admin_token = login_response.json()["access_token"]
            
            # Obtener usuarios
            response = await client.get("/auth/users", headers={
                "Authorization": f"Bearer {admin_token}"
            })
            assert response.status_code == status.HTTP_200_OK
            assert isinstance(response.json(), list)
            
    @pytest.mark.asyncio
    async def test_non_admin_get_users_forbidden(self):
        """Test endpoint de usuarios con usuario no admin"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # Registrar usuario normal
            await client.post("/auth/register", json={
                "email": "user@example.com",
                "password": "UserPass123"
            })
            
            # Login como usuario normal
            login_response = await client.post("/auth/login", data={
                "username": "user@example.com",
                "password": "UserPass123"
            })
            user_token = login_response.json()["access_token"]
            
            # Intentar obtener usuarios
            response = await client.get("/auth/users", headers={
                "Authorization": f"Bearer {user_token}"
            })
            assert response.status_code == status.HTTP_403_FORBIDDEN


class TestAuthIntegration:
    """Tests de integración completos"""
    
    @pytest.mark.asyncio
    async def test_complete_user_flow(self):
        """Test de flujo completo de usuario"""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://localhost:8000") as client:
            # 1. Registro
            register_response = await client.post("/auth/register", json={
                "email": "complete@example.com",
                "password": "CompletePass123",
                "role_name": "doctor"
            })
            assert register_response.status_code == status.HTTP_201_CREATED
            
            # 2. Login
            login_response = await client.post("/auth/login", data={
                "username": "complete@example.com",
                "password": "CompletePass123"
            })
            assert login_response.status_code == status.HTTP_200_OK
            tokens = login_response.json()
            
            # 3. Verificar perfil
            me_response = await client.get("/auth/me", headers={
                "Authorization": f"Bearer {tokens['access_token']}"
            })
            assert me_response.status_code == status.HTTP_200_OK
            user_data = me_response.json()
            assert user_data["email"] == "complete@example.com"
            assert user_data["role_name"] == "doctor"
            
            # 4. Cambiar contraseña
            change_password_response = await client.post("/auth/change-password",
                json={
                    "current_password": "CompletePass123",
                    "new_password": "NewCompletePass123"
                },
                headers={"Authorization": f"Bearer {tokens['access_token']}"}
            )
            assert change_password_response.status_code == status.HTTP_200_OK
            
            # 5. Login con nueva contraseña
            new_login_response = await client.post("/auth/login", data={
                "username": "complete@example.com",
                "password": "NewCompletePass123"
            })
            assert new_login_response.status_code == status.HTTP_200_OK
            
            # 6. Refresh token
            refresh_response = await client.post("/auth/refresh", json={
                "refresh_token": tokens["refresh_token"]
            })
            assert refresh_response.status_code == status.HTTP_200_OK


if __name__ == "__main__":
    pytest.main([__file__, "-v"])