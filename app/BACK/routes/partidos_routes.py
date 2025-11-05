from flask import Blueprint, jsonify, request
from db import get_mysql_connection

partidos_bp = Blueprint("partidos_bp", __name__, url_prefix="/api/partidos")

# ============================================================
# ✅ LISTAR PARTIDOS (con nombres de equipos)
# ============================================================
@partidos_bp.route("/", methods=["GET"])
def get_partidos():
    try:
        conn = get_mysql_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT 
                p.id_partido,
                p.fecha_hora,
                p.jornada,
                p.estado,
                el.nombre AS equipo_local,
                ev.nombre AS equipo_visitante
            FROM partido p
            LEFT JOIN equipo el ON p.id_equipo_local = el.id_equipo
            LEFT JOIN equipo ev ON p.id_equipo_visitante = ev.id_equipo
            ORDER BY p.fecha_hora DESC;
        """)

        data = cur.fetchall()
        cur.close()
        conn.close()

        print(f"✅ {len(data)} partidos cargados correctamente.")
        return jsonify(data), 200

    except Exception as e:
        print("❌ Error al obtener partidos:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# ✅ CREAR PARTIDO
# ============================================================
@partidos_bp.route("/", methods=["POST"])
def crear_partido():
    try:
        data = request.get_json()
        fecha_hora = data.get("fecha_hora")
        jornada = data.get("jornada")
        estado = data.get("estado", "Programado")
        id_equipo_local = data.get("id_equipo_local")
        id_equipo_visitante = data.get("id_equipo_visitante")

        if not fecha_hora or not jornada:
            return jsonify({"error": "Los campos 'fecha_hora' y 'jornada' son obligatorios"}), 400

        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO partido (fecha_hora, jornada, estado, id_equipo_local, id_equipo_visitante)
            VALUES (%s, %s, %s, %s, %s)
        """, (fecha_hora, jornada, estado, id_equipo_local, id_equipo_visitante))
        conn.commit()
        cur.close()
        conn.close()

        print(f"✅ Partido creado correctamente ({fecha_hora}, jornada {jornada})")
        return jsonify({"message": "✅ Partido creado correctamente"}), 201

    except Exception as e:
        print("❌ Error al crear partido:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# ✅ EDITAR PARTIDO
# ============================================================
@partidos_bp.route("/<int:id_partido>", methods=["PUT"])
def editar_partido(id_partido):
    try:
        data = request.get_json()
        fecha_hora = data.get("fecha_hora")
        jornada = data.get("jornada")
        estado = data.get("estado")
        id_equipo_local = data.get("id_equipo_local")
        id_equipo_visitante = data.get("id_equipo_visitante")

        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE partido
            SET fecha_hora=%s, jornada=%s, estado=%s, id_equipo_local=%s, id_equipo_visitante=%s
            WHERE id_partido=%s
        """, (fecha_hora, jornada, estado, id_equipo_local, id_equipo_visitante, id_partido))
        conn.commit()
        filas = cur.rowcount
        cur.close()
        conn.close()

        if filas == 0:
            return jsonify({"error": "Partido no encontrado"}), 404

        print(f"✏️ Partido ID {id_partido} actualizado correctamente.")
        return jsonify({"message": "✏️ Partido actualizado correctamente"}), 200

    except Exception as e:
        print("❌ Error al editar partido:", e)
        return jsonify({"error": str(e)}), 500


# ============================================================
# ✅ ELIMINAR PARTIDO
# ============================================================
@partidos_bp.route("/<int:id_partido>", methods=["DELETE"])
def eliminar_partido(id_partido):
    try:
        conn = get_mysql_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM partido WHERE id_partido = %s", (id_partido,))
        conn.commit()
        filas = cur.rowcount
        cur.close()
        conn.close()

        if filas == 0:
            return jsonify({"error": "Partido no encontrado"}), 404

        print(f"🗑️ Partido ID {id_partido} eliminado correctamente.")
        return jsonify({"message": "🗑️ Partido eliminado correctamente"}), 200

    except Exception as e:
        print("❌ Error al eliminar partido:", e)
        return jsonify({"error": str(e)}), 500
