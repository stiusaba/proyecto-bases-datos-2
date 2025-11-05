from flask import Blueprint, jsonify
from db import get_mysql_connection

temporadas_bp = Blueprint("temporadas_bp", __name__, url_prefix="/api/temporadas")

@temporadas_bp.get("")
def get_temporadas():
    conn = get_mysql_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT id_temporada, nombre_competicion AS nombre, ano_inicio, ano_fin
        FROM temporada
        ORDER BY id_temporada DESC
    """)
    data = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(data)
