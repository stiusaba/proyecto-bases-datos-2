from flask import Blueprint, jsonify, request
from db import get_mysql_connection

jugadores_bp = Blueprint("jugadores_bp", __name__, url_prefix="/api/jugadores")

# ============================================================
# ✅ OBTENER TODOS LOS JUGADORES
# ============================================================
@jugadores_bp.get("")
def get_jugadores():
    try:
        conn = get_mysql_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM jugador ORDER BY id_jugador")
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(data), 200
    except Exception as e:
        print("❌ Error al listar jugadores:", e)
        return jsonify({"error": str(e)}), 500

# ============================================================
# ✅ CREAR JUGADOR
# ============================================================
@jugadores_bp.post("")
def create_jugador():
    # Recibe los datos del frontend
    data = request.get_json() or {}
    nombre = data.get("nombre")
    posicion = data.get("posicion")
    id_equipo = data.get("id_equipo")  # id del equipo
    dorsal = data.get("dorsal")
    goles = data.get("goles")

    # Validación de datos
    if not nombre or not posicion or not id_equipo:
        return jsonify({"error": "Nombre, posición y equipo son obligatorios"}), 400

    try:
        # Conexión a la base de datos
        conn = get_mysql_connection()
        cur = conn.cursor()
        
        # Insertar el nuevo jugador en la base de datos
        cur.execute("""
            INSERT INTO jugador (nombre, posicion, dorsal, goles, id_equipo)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre, posicion, dorsal, goles, id_equipo))
        conn.commit()

        # Obtener el id del nuevo jugador
        new_id = cur.lastrowid
        cur.close()
        conn.close()

        return jsonify({
            "message": "Jugador creado correctamente ✅",
            "id_jugador": new_id
        }), 201  # Respuesta exitosa

    except Exception as e:
        print("❌ Error al crear jugador:", e)
        return jsonify({"error": str(e)}), 500

# ============================================================
# ✅ ACTUALIZAR JUGADOR
# ============================================================
@jugadores_bp.put("/<int:id_jugador>")
def update_jugador(id_jugador):
    data = request.get_json() or {}
    nombre = data.get("nombre")
    apellido = data.get("apellido")
    posicion = data.get("posicion")
    dorsal = data.get("dorsal")
    estado = data.get("estado")
    valor_mercado = data.get("valor_mercado")
    id_equipo = data.get("id_equipo")

    try:
        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE jugador
            SET nombre=%s, apellido=%s, posicion=%s, dorsal=%s, estado=%s, valor_mercado=%s, id_equipo=%s
            WHERE id_jugador=%s
        """, (nombre, apellido, posicion, dorsal, estado, valor_mercado, id_equipo, id_jugador))
        conn.commit()
        filas = cur.rowcount
        cur.close()
        conn.close()

        if filas == 0:
            return jsonify({"error": "Jugador no encontrado"}), 404
        return jsonify({"message": "Jugador actualizado correctamente ✅"}), 200
    except Exception as e:
        print("❌ Error al actualizar jugador:", e)
        return jsonify({"error": str(e)}), 500

# ============================================================
# ✅ ELIMINAR JUGADOR
# ============================================================
@jugadores_bp.delete("/<int:id_jugador>")
def delete_jugador(id_jugador):
    try:
        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM jugador WHERE id_jugador=%s", (id_jugador,))
        conn.commit()
        filas = cur.rowcount
        cur.close()
        conn.close()

        if filas == 0:
            return jsonify({"error": "Jugador no encontrado"}), 404
        return jsonify({"message": "Jugador eliminado correctamente ✅"}), 200
    except Exception as e:
        print("❌ Error al eliminar jugador:", e)
        return jsonify({"error": str(e)}), 500
