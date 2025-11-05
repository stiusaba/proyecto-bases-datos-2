from flask import Blueprint, request, jsonify
from db import get_mysql_connection

equipos_bp = Blueprint("equipos_bp", __name__, url_prefix="/api/equipos")

# ============================================================
# ✅ OBTENER TODOS LOS EQUIPOS
# ============================================================
@equipos_bp.get("")
def get_equipos():
    try:
        conn = get_mysql_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM equipo ORDER BY id_equipo")
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(data), 200
    except Exception as e:
        print("❌ Error al listar equipos:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# ✅ CREAR EQUIPO
# ============================================================
@equipos_bp.post("")
def create_equipo():
    d = request.get_json() or {}
    nombre = d.get("nombre")
    ciudad = d.get("ciudad")
    presupuesto = d.get("presupuesto")
    estadio = d.get("estadio")
    contacto_email = d.get("contacto_email")
    escudo = d.get("escudo")

    if not nombre or not ciudad:
        return jsonify({"error": "Los campos 'nombre' y 'ciudad' son obligatorios"}), 400

    try:
        conn = get_mysql_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            INSERT INTO equipo (nombre, ciudad, presupuesto, estadio, contacto_email, escudo)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (nombre, ciudad, presupuesto, estadio, contacto_email, escudo))
        conn.commit()
        new_id = cur.lastrowid
        cur.close()
        conn.close()
        return jsonify({
            "message": "Equipo creado correctamente ✅",
            "id_equipo": new_id
        }), 201
    except Exception as e:
        print("❌ Error al crear equipo:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# ✅ ACTUALIZAR EQUIPO
# ============================================================
@equipos_bp.put("/<int:id_equipo>")
def update_equipo(id_equipo):
    d = request.get_json() or {}
    nombre = d.get("nombre")
    ciudad = d.get("ciudad")
    presupuesto = d.get("presupuesto")
    estadio = d.get("estadio")
    contacto_email = d.get("contacto_email")
    escudo = d.get("escudo")

    try:
        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE equipo
            SET nombre=%s, ciudad=%s, presupuesto=%s, estadio=%s, contacto_email=%s, escudo=%s
            WHERE id_equipo=%s
        """, (nombre, ciudad, presupuesto, estadio, contacto_email, escudo, id_equipo))
        conn.commit()
        filas = cur.rowcount
        cur.close()
        conn.close()

        if filas == 0:
            return jsonify({"error": "Equipo no encontrado"}), 404
        return jsonify({"message": "Equipo actualizado correctamente ✅"}), 200
    except Exception as e:
        print("❌ Error al actualizar equipo:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# ✅ ELIMINAR EQUIPO
# ============================================================
@equipos_bp.delete("/<int:id_equipo>")
def delete_equipo(id_equipo):
    try:
        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM equipo WHERE id_equipo=%s", (id_equipo,))
        conn.commit()
        filas = cur.rowcount
        cur.close()
        conn.close()

        if filas == 0:
            return jsonify({"error": "Equipo no encontrado"}), 404
        return jsonify({"message": "Equipo eliminado correctamente ✅"}), 200
    except Exception as e:
        print("❌ Error al eliminar equipo:", e)
        return jsonify({"error": str(e)}), 500
