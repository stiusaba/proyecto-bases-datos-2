from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.equipos_routes import equipos_bp
from routes.jugadores_routes import jugadores_bp
from routes.partidos_routes import partidos_bp
from routes.reportes_routes import reportes_bp
from routes.transferencias_routes import transferencias_bp
from routes.temporadas_routes import temporadas_bp
from routes.noticias_routes import noticias_bp
from dotenv import load_dotenv
import os

# ======================
# Cargar variables de entorno
# ======================
load_dotenv()

# ======================
# Inicializar aplicación Flask
# ======================
app = Flask(__name__, static_folder="static", template_folder="templates")

# Configuración base
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "clave_fallback_segura")
print(f"🔐 SECRET_KEY cargada: {app.config['SECRET_KEY']}")

# Activar CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ======================
# Registrar Blueprints
# ======================
app.register_blueprint(auth_bp)
app.register_blueprint(equipos_bp)
app.register_blueprint(jugadores_bp)
app.register_blueprint(partidos_bp)
app.register_blueprint(reportes_bp)
app.register_blueprint(transferencias_bp)
app.register_blueprint(temporadas_bp)
app.register_blueprint(noticias_bp)

# ======================
# Rutas principales
# ======================
@app.route("/")
def index():
    return render_template("login.html")

@app.route("/<path:filename>")
def render_page(filename):
    if os.path.exists(os.path.join(app.template_folder, filename)):
        return render_template(filename)
    return send_from_directory(app.static_folder, filename)

@app.route("/api/ping")
def ping():
    return jsonify({"message": "Servidor Flask funcionando correctamente ✅"})

# ======================
# Punto de entrada
# ======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    