from flask import Blueprint, jsonify, request
from db import get_mysql_connection
from utils.security import hash_password, verify_password, generate_token, verify_token

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/api/auth")


# ================= REGISTRO DE USUARIO =================
@auth_bp.post("/register")
def register_user():
    data = request.get_json()
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not nombre or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    hashed = hash_password(password)
    conn = get_mysql_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)",
            (nombre, email, hashed)
        )
        conn.commit()
        return jsonify({"message": "Usuario registrado correctamente ✅"}), 201
    except Exception as e:
        print("Error en registro:", e)
        return jsonify({"error": "El correo ya está registrado o hubo un error"}), 400
    finally:
        cursor.close()
        conn.close()


# ================= LOGIN DE USUARIO =================
@auth_bp.post("/login")
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if not (user["password"] == password or verify_password(password, user["password"])):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    token = generate_token(user["id"], user["email"])
    return jsonify({"message": "Login exitoso ✅", "token": token, "user": user}), 200


@auth_bp.get("/profile")
def get_profile():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token no proporcionado"}), 401

    payload = verify_token(token)
    if not payload:
        return jsonify({"error": "Token inválido o expirado"}), 401

    return jsonify({"message": "Token válido", "data": payload}), 200

