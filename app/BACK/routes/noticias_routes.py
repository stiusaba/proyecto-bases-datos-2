from flask import Blueprint, jsonify, request
from bson import ObjectId
from db import get_mongo_db

noticias_bp = Blueprint("noticias_bp", __name__, url_prefix="/api/noticias/")

# ------------------------------------------------------
# 🔹 Función recursiva para convertir ObjectId a str
# ------------------------------------------------------
def serialize_obj(obj):
    """Convierte recursivamente todos los ObjectId en strings."""
    if isinstance(obj, list):
        return [serialize_obj(i) for i in obj]
    elif isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            new_obj[k] = serialize_obj(v)
        return new_obj
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj


# ------------------------------------------------------
# 🔹 Obtener todas las noticias
# ------------------------------------------------------
@noticias_bp.route("/", methods=["GET"])
def get_noticias():
    db = get_mongo_db()
    if db is None:
        return jsonify({"error": "No se pudo conectar a MongoDB"}), 500

    try:
        noticias = list(db.noticias.find())
        noticias = serialize_obj(noticias)
        return jsonify(noticias), 200
    except Exception as e:
        print("❌ Error al obtener noticias:", e)
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------
# 🔹 Crear una nueva noticia
# ------------------------------------------------------
@noticias_bp.route("/", methods=["POST"])
def create_noticia():
    db = get_mongo_db()
    if db is None:
        return jsonify({"error": "No se pudo conectar a MongoDB"}), 500

    data = request.get_json()
    if not data or "titulo" not in data or "contenido" not in data:
        return jsonify({"error": "Los campos 'titulo' y 'contenido' son obligatorios"}), 400

    try:
        result = db.noticias.insert_one({
            "titulo": data["titulo"],
            "contenido": data["contenido"],
            "autor": data.get("autor", "Anónimo"),
            "fecha": data.get("fecha")
        })
        nueva = db.noticias.find_one({"_id": result.inserted_id})
        return jsonify(serialize_obj(nueva)), 201
    except Exception as e:
        print("❌ Error al crear noticia:", e)
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------
# 🔹 Actualizar noticia
# ------------------------------------------------------
@noticias_bp.route("/<id>", methods=["PUT"])
def update_noticia(id):
    db = get_mongo_db()
    if db is None:
        return jsonify({"error": "No se pudo conectar a MongoDB"}), 500

    data = request.get_json()
    try:
        db.noticias.update_one({"_id": ObjectId(id)}, {"$set": data})
        actualizada = db.noticias.find_one({"_id": ObjectId(id)})
        return jsonify(serialize_obj(actualizada)), 200
    except Exception as e:
        print("❌ Error al actualizar noticia:", e)
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------------
# 🔹 Eliminar noticia
# ------------------------------------------------------
@noticias_bp.route("/<id>", methods=["DELETE"])
def delete_noticia(id):
    db = get_mongo_db()
    if db is None:
        return jsonify({"error": "No se pudo conectar a MongoDB"}), 500

    try:
        db.noticias.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "🗑️ Noticia eliminada correctamente"}), 200
    except Exception as e:
        print("❌ Error al eliminar noticia:", e)
        return jsonify({"error": str(e)}), 500
