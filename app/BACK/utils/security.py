import bcrypt
import jwt
import datetime
from flask import current_app

# ==========================
# ENCRIPTACIÓN DE CONTRASEÑAS
# ==========================

def hash_password(password: str) -> str:
    """Genera un hash seguro para una contraseña usando bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Verifica que la contraseña ingresada coincida con el hash"""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception as e:
        print("Error verificando contraseña:", e)
        return False

# ==========================
# TOKEN JWT
# ==========================

def generate_token(user_id, email):
    """Genera un token JWT con expiración de 2 horas"""
    try:
        # Asegurar que todos los datos sean cadenas normales
        uid = str(user_id)
        eml = str(email).strip()

        payload = {
            "user_id": uid,
            "email": eml,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }

        token = jwt.encode(
            payload,
            current_app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        # Convertir bytes a string (compatibilidad extra con PyJWT antiguos)
        if isinstance(token, bytes):
            token = token.decode("utf-8")

        return token
    except Exception as e:
        print("Error generando token:", e)
        print(f"Datos problemáticos -> ID: {user_id} ({type(user_id)}), EMAIL: {email} ({type(email)})")
        return None



def verify_token(token: str):
    """Verifica y decodifica un token JWT"""
    try:
        payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("⚠️ Token expirado")
        return None
    except jwt.InvalidTokenError:
        print("❌ Token inválido")
        return None
