# Implementación de MongoDB en Ubuntu Server 24.04  
**Proyecto:** Liga de Fútbol – Sistema de Noticias y Multimedia  

---

## Introducción

Este documento describe el proceso de **instalación, configuración y verificación** del motor de base de datos NoSQL **MongoDB**, utilizado para gestionar la información **documental y no estructurada** del sistema de **noticias, usuarios, multimedia y comentarios** del proyecto *"Liga de Fútbol"*.  

MongoDB fue seleccionado por su modelo flexible basado en documentos **JSON/BSON**, su compatibilidad con **Ubuntu Server 24.04** y su facilidad de integración con el backend en **Python** mediante la librería `pymongo`.

---

## Requisitos previos

Antes de la instalación, se debe contar con:

- Máquina virtual **ubuntu-db** (ya implementada).  
- Acceso de usuario con privilegios `sudo`.  
- Conectividad a internet verificada.  
- Espacio disponible de al menos **20 GB** para la base de datos.

Verificar conexión:

```bash
ping google.com
```

---

## Instalación de MongoDB en Ubuntu 24.04

### 1. Importar la clave pública GPG de MongoDB

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

### 2. Agregar el repositorio oficial de MongoDB

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### 3. Instalar el paquete de MongoDB

```bash
sudo apt update
sudo apt install -y mongodb-org
```

### 4. Iniciar y habilitar el servicio

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

Si el servicio está activo, el estado debe mostrar:

```
active (running)
```

---

## Verificación de instalación

Acceder al shell interactivo de MongoDB:

```bash
mongosh
```

Crear la base de datos del sistema de noticias:

```javascript
use liga_futbol_noticias
```

Insertar un documento de prueba:

```javascript
db.usuarios.insertOne({
  nombre_usuario: "admin",
  email: "admin@ligafutbol.com",
  rol: "editor",
  estado: "activo"
})
```

Verificar bases de datos creadas:

```javascript
show dbs
```

Consultar datos insertados:

```javascript
db.usuarios.find().pretty()
```

---

## Configuración del servicio y seguridad

### 1. Habilitar autenticación de usuarios

Editar el archivo de configuración:

```bash
sudo nano /etc/mongod.conf
```

Buscar la línea:

```yaml
#security:
```

Y modificarla por:

```yaml
security:
  authorization: enabled
```

Reiniciar el servicio:

```bash
sudo systemctl restart mongod
```

### 2. Crear usuario administrador

Dentro de `mongosh`:

```javascript
use admin
db.createUser({
  user: "mongo_admin",
  pwd: "Admin123$",
  roles: [ { role: "root", db: "admin" } ]
})
```

Cerrar sesión y volver a ingresar autenticándose:

```bash
mongosh -u "mongo_admin" -p "Admin123$" --authenticationDatabase "admin"
```

---

## Configuración de red y acceso remoto

Por defecto, MongoDB escucha únicamente conexiones locales.  
Para permitir acceso remoto (solo si el backend no está en la misma máquina):

Editar el archivo de configuración:

```bash
sudo nano /etc/mongod.conf
```

Localizar la línea:

```yaml
bindIp: 127.0.0.1
```

Y reemplazarla por:

```yaml
bindIp: 0.0.0.0
```

Guardar los cambios y reiniciar:

```bash
sudo systemctl restart mongod
```

Permitir el puerto 27017 en el firewall:

```bash
sudo ufw allow 27017/tcp
sudo ufw status
```

---

## Integración con Python (prueba funcional)

Instalar la librería `pymongo`:

```bash
pip install pymongo
```

Ejemplo básico de conexión:

```python
from pymongo import MongoClient

cliente = MongoClient("mongodb://mongo_admin:Admin123$@localhost:27017/")
db = cliente["liga_futbol_noticias"]

usuario = {
    "nombre_usuario": "s_tiusaba",
    "email": "stiusaba@example.com",
    "rol": "editor"
}

db.usuarios.insert_one(usuario)

for u in db.usuarios.find():
    print(u)
```

Si la conexión y la inserción son exitosas, la implementación está completa.

---

## Prueba de inserciones relacionadas al modelo documental

```javascript
use liga_futbol_noticias

db.noticias.insertOne({
  titulo: "Nueva victoria de Santa Fe en la Liga",
  contenido: "El equipo capitalino logró imponerse con marcador 2-0 frente a Nacional.",
  categoria: "Deportes",
  fecha_publicacion: ISODate("2025-11-01T18:00:00Z"),
  comentarios: [],
  visitas: 0
})
```

Verificar:

```javascript
db.noticias.find().pretty()
```

---

## Recomendaciones

- Realizar respaldos periódicos con `mongodump`:

  ```bash
  mongodump --db liga_futbol_noticias --out ~/backups/mongo/
  ```

- Restaurar con:

  ```bash
  mongorestore ~/backups/mongo/
  ```

- Monitorear el servicio:

  ```bash
  sudo systemctl status mongod
  ```

- Utilizar **MongoDB Compass** para administración gráfica (opcional).

---

## Conclusión

MongoDB fue **instalado, configurado y verificado exitosamente** en la máquina virtual **ubuntu-db** bajo **Ubuntu Server 24.04 LTS**.  
El motor se encuentra listo para manejar la información documental del **sistema de noticias, usuarios, etiquetas y multimedia**, integrándose con el backend desarrollado en **Python**.  

Esta implementación cumple con los **requisitos técnicos de la Fase 2** del proyecto *"Liga de Fútbol"* y establece la base del componente **NoSQL** dentro del sistema.
