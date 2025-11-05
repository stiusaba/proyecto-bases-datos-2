import mysql.connector
from mysql.connector import Error

# 🔧 Credenciales de Railway (pon exactamente las tuyas)
config = {
    "host": "shinkansen.proxy.rlwy.net",
    "port": 11179,
    "user": "root",
    "password": "sGtHibOzqqiVlQUzkwRrTiDoaQkVeOAr",
    "database": "railway"
}

try:
    print("🔄 Intentando conectar a MySQL en Railway...")
    conn = mysql.connector.connect(**config)

    if conn.is_connected():
        print("✅ Conexión exitosa.")
        cur = conn.cursor()
        cur.execute("SELECT NOW();")
        result = cur.fetchone()
        print("🕓 Hora del servidor MySQL:", result[0])
        cur.close()
    else:
        print("❌ No se logró conectar.")

except Error as e:
    print("🚫 Error al conectar a MySQL:", e)

finally:
    if 'conn' in locals() and conn.is_connected():
        conn.close()
        print("🔒 Conexión cerrada.")
