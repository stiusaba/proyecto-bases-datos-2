import mysql.connector
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

# ========== CONEXIÓN MYSQL ==========
def get_mysql_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            port=int(os.getenv("MYSQL_PORT")),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE")
        )
        print("✅ Conectado a MySQL correctamente.")
        return connection
    except Exception as e:
        print("❌ Error conectando a MySQL:", e)
        return None


# ✅ Conexión Mongo Atlas
def get_mongo_db():
    try:
        mongo_uri = os.getenv("MONGO_URI")
        db_name = os.getenv("MONGO_DB", "noticias_db")
        client = MongoClient(mongo_uri)
        db = client[db_name]
        print(f"✅ Conectado a Mongo Atlas: {db_name}")
        return db
    except Exception as e:
        print("❌ Error conectando a MongoDB Atlas:", e)
        return None