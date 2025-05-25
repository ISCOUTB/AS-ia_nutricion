"""
Script de diagnóstico para problemas con JWT
"""

import sys
import subprocess

def run_command(cmd):
    """Ejecutar comando y capturar salida"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return "", str(e), 1

def main():
    print("=== DIAGNÓSTICO DE JWT ===\n")
    
    # 1. Verificar instalaciones de pip
    print("1. Verificando paquetes instalados:")
    stdout, stderr, _ = run_command("pip list | grep -i jwt")
    if stdout:
        print(stdout)
    else:
        print("No se encontraron paquetes JWT instalados")
    
    print("\n" + "="*50 + "\n")
    
    # 2. Verificar importaciones
    print("2. Verificando importaciones:")
    
    # PyJWT
    try:
        import jwt
        print(f"✅ import jwt - SUCCESS")
        print(f"   Module: {jwt}")
        print(f"   Name: {getattr(jwt, '__name__', 'N/A')}")
        print(f"   Version: {getattr(jwt, '__version__', 'N/A')}")
        print(f"   File: {getattr(jwt, '__file__', 'N/A')}")
        print(f"   Has encode: {hasattr(jwt, 'encode')}")
        print(f"   Has decode: {hasattr(jwt, 'decode')}")
        
        if hasattr(jwt, 'encode'):
            print(f"   Encode method: {jwt.encode}")
        if hasattr(jwt, 'decode'):
            print(f"   Decode method: {jwt.decode}")
            
    except ImportError as e:
        print(f"❌ import jwt - FAILED: {e}")
    
    print()
    
    # python-jose
    try:
        from jose import jwt as jose_jwt
        print(f"✅ from jose import jwt - SUCCESS")
        print(f"   Module: {jose_jwt}")
        print(f"   Has encode: {hasattr(jose_jwt, 'encode')}")
        print(f"   Has decode: {hasattr(jose_jwt, 'decode')}")
    except ImportError as e:
        print(f"❌ from jose import jwt - FAILED: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # 3. Test funcional
    print("3. Test funcional:")
    try:
        import jwt
        from datetime import datetime, timedelta, timezone
        
        # Test de encoding
        payload = {
            "sub": "test_user",
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
            "iat": datetime.now(timezone.utc)
        }
        
        token = jwt.encode(payload, "test_secret", algorithm="HS256")
        print(f"✅ Encoding test - SUCCESS")
        print(f"   Token type: {type(token)}")
        print(f"   Token length: {len(token) if token else 0}")
        
        # Test de decoding
        decoded = jwt.decode(token, "test_secret", algorithms=["HS256"])
        print(f"✅ Decoding test - SUCCESS")
        print(f"   Decoded: {decoded}")
        
    except Exception as e:
        print(f"❌ Functional test - FAILED: {e}")
        import traceback
        print(f"   Traceback: {traceback.format_exc()}")
    
    print("\n" + "="*50 + "\n")
    
    # 4. Información del sistema
    print("4. Información del sistema:")
    print(f"Python version: {sys.version}")
    print(f"Python path: {sys.executable}")
    
    # Variables de entorno
    import os
    print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")
    
    print("\n" + "="*50 + "\n")
    
    # 5. Recomendaciones
    print("5. Recomendaciones:")
    
    try:
        import jwt
        if not hasattr(jwt, 'encode'):
            print("❌ PyJWT no tiene método encode")
            print("   Solución: pip uninstall jwt && pip install PyJWT")
        else:
            print("✅ PyJWT parece estar funcionando correctamente")
    except ImportError:
        print("❌ PyJWT no está instalado")
        print("   Solución: pip install PyJWT>=2.4.0")

if __name__ == "__main__":
    main()