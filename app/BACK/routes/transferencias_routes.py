from flask import Blueprint, request, jsonify
from db import get_mysql_connection

transferencias_bp = Blueprint("transferencias_bp", __name__, url_prefix="/api/transferencias")

# ============================================================
# ✅ LISTAR TRANSFERENCIAS
# ============================================================
@transferencias_bp.route("/", methods=["GET"])
def get_transferencias():
    conn = get_mysql_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT 
            t.id_transferencia,
            t.id_jugador,
            j.nombre AS jugador,
            t.id_equipo_origen AS desde,
            eo.nombre AS equipo_origen,
            t.id_equipo_destino AS hacia,
            ed.nombre AS equipo_destino,
            t.valor_transferencia AS monto,
            t.fecha_transferencia AS fecha,
            t.estado
        FROM transferencia t
        JOIN jugador j ON j.id_jugador = t.id_jugador
        JOIN equipo eo ON eo.id_equipo = t.id_equipo_origen
        JOIN equipo ed ON ed.id_equipo = t.id_equipo_destino
        ORDER BY t.fecha_transferencia DESC;
    """)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data), 200


# ============================================================
# ✅ CREAR TRANSFERENCIA
# ============================================================
@transferencias_bp.route("/", methods=["POST"])
def crear_transferencia():
    d = request.get_json() or {}
    id_jugador = d.get("id_jugador")
    id_equipo_origen = d.get("desde")
    id_equipo_destino = d.get("hacia")
    valor_transferencia = d.get("monto")
    fecha_transferencia = d.get("fecha")
    estado = d.get("estado", "PENDIENTE")

    if not id_jugador or not id_equipo_origen or not id_equipo_destino:
        return jsonify({"error": "Campos obligatorios: jugador, origen y destino"}), 400

    conn = get_mysql_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO transferencia (id_jugador, id_equipo_origen, id_equipo_destino, valor_transferencia, fecha_transferencia, estado)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (id_jugador, id_equipo_origen, id_equipo_destino, valor_transferencia, fecha_transferencia, estado))
    conn.commit()
    new_id = cur.lastrowid
    cur.close()
    conn.close()

    return jsonify({"message": "✅ Transferencia creada correctamente", "id_transferencia": new_id}), 201


# ============================================================
# ✅ EDITAR TRANSFERENCIA
# ============================================================
@transferencias_bp.route("/<int:id_transferencia>", methods=["PUT"])
def editar_transferencia(id_transferencia):
    d = request.get_json() or {}
    id_jugador = d.get("id_jugador")
    id_equipo_origen = d.get("desde")
    id_equipo_destino = d.get("hacia")
    valor_transferencia = d.get("monto")
    fecha_transferencia = d.get("fecha")
    estado = d.get("estado", "PENDIENTE")

    conn = get_mysql_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE transferencia
        SET id_jugador=%s, id_equipo_origen=%s, id_equipo_destino=%s,
            valor_transferencia=%s, fecha_transferencia=%s, estado=%s
        WHERE id_transferencia=%s
    """, (id_jugador, id_equipo_origen, id_equipo_destino, valor_transferencia, fecha_transferencia, estado, id_transferencia))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "✏️ Transferencia actualizada correctamente"}), 200


# ============================================================
# ✅ ELIMINAR TRANSFERENCIA
# ============================================================
@transferencias_bp.route("/<int:id_transferencia>", methods=["DELETE"])
def eliminar_transferencia(id_transferencia):
    conn = get_mysql_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM transferencia WHERE id_transferencia=%s", (id_transferencia,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "🗑️ Transferencia eliminada correctamente"}), 200
