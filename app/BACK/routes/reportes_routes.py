from flask import Blueprint, jsonify
from db import get_mysql_connection

reportes_bp = Blueprint("reportes_bp", __name__, url_prefix="/api/reportes")

# Tabla de posiciones
@reportes_bp.get("/tabla-posiciones/<int:id_temporada>")
def tabla_posiciones(id_temporada):
    conn = get_mysql_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT e.nombre AS equipo, tp.puntos, tp.partidos_jugados, tp.ganados,
               tp.empatados, tp.perdidos, tp.goles_favor, tp.goles_contra,
               tp.diferencia_goles
        FROM tabla_posiciones tp
        JOIN equipo e ON e.id_equipo = tp.id_equipo
        WHERE tp.id_temporada = %s
        ORDER BY tp.puntos DESC, tp.diferencia_goles DESC
    """, (id_temporada,))
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

# Top goleadores
@reportes_bp.get("/top-goleadores")
def top_goleadores():
    conn = get_mysql_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT j.nombre, j.apellido, SUM(e.goles) AS goles
        FROM estadistica e
        JOIN jugador j ON j.id_jugador = e.id_jugador
        GROUP BY j.id_jugador
        ORDER BY goles DESC
        LIMIT 10
    """)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)

# Partidos recientes
@reportes_bp.get("/partidos-recientes")
def partidos_recientes():
    conn = get_mysql_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT p.id_partido, e1.nombre AS local, e2.nombre AS visitante,
               p.goles_local, p.goles_visitante, p.estado, p.fecha_hora
        FROM partido p
        JOIN equipo e1 ON p.id_equipo_local = e1.id_equipo
        JOIN equipo e2 ON p.id_equipo_visitante = e2.id_equipo
        ORDER BY p.fecha_hora DESC LIMIT 5
    """)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)
