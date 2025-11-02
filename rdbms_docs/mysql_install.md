# Implementación y Selección del Motor de Base de Datos Relacional (RDBMS) – MySQL

## Introducción
El proyecto **"Liga de Fútbol"** requiere un Sistema Gestor de Bases de Datos Relacional (RDBMS) que ofrezca estabilidad, rendimiento, seguridad y facilidad de integración con aplicaciones web desarrolladas en Python.  
El RDBMS seleccionado es **MySQL Server 8.0**, por ser una de las soluciones más completas y estables de código abierto disponibles para entornos Linux.

---

## Análisis y justificación de la selección

1. **Compatibilidad**
   - MySQL es totalmente compatible con sistemas operativos basados en Linux, incluyendo Ubuntu Server 24.04.
   - Posee controladores nativos para lenguajes como Python, PHP y Java, lo cual facilita la integración con aplicaciones web.

2. **Estabilidad y rendimiento**
   - Utiliza el motor de almacenamiento **InnoDB**, que soporta transacciones ACID, bloqueo a nivel de fila y control de integridad referencial.
   - Permite manejar grandes volúmenes de información de manera eficiente.

3. **Seguridad**
   - Admite control detallado de privilegios por usuario, conexiones seguras y cifrado de contraseñas.
   - Ofrece herramientas integradas como `mysql_secure_installation` para fortalecer la configuración inicial.

4. **Escalabilidad**
   - Soporta replicación, particionado de tablas y balanceo de carga, lo que lo hace ideal para aplicaciones en crecimiento.

5. **Soporte y comunidad**
   - MySQL cuenta con una amplia documentación oficial y una comunidad global activa, lo cual garantiza soporte y actualizaciones continuas.

---

## Instalación del motor MySQL en Ubuntu Server

### 1. Actualización del sistema operativo
Antes de instalar MySQL, se actualizan los paquetes del sistema:
```bash
sudo apt update && sudo apt upgrade -y
```


## 2. Instalación del paquete MySQL Server

Se instala el servicio principal de MySQL con el siguiente comando:

```bash
sudo apt install -y mysql-server
```

Una vez instalado, se habilita y se inicia el servicio:

```bash
sudo systemctl enable mysql
sudo systemctl start mysql
```

---

## 3. Verificación del estado del servicio

Para comprobar que MySQL está funcionando correctamente:

```bash
sudo systemctl status mysql
```

Si el servicio está activo, el sistema mostrará el estado como **active (running)**.

---

## Configuración inicial de MySQL

Ejecutar el asistente de seguridad:

```bash
sudo mysql_secure_installation
```

Durante la ejecución, se recomienda la siguiente configuración:

- Validar la fortaleza de contraseñas: **No**
- Eliminar usuarios anónimos: **Sí**
- Deshabilitar acceso remoto del usuario root: **Sí**
- Eliminar base de datos de prueba: **Sí**
- Recargar privilegios: **Sí**

---

## Creación de la base de datos del proyecto

Acceder a la consola de MySQL:

```bash
sudo mysql
```

Crear la base de datos principal y el usuario de la aplicación:

```sql
CREATE DATABASE soccerdb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'app_user'@'%' IDENTIFIED BY 'app_pass';
GRANT ALL PRIVILEGES ON soccerdb.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

Verificar la creación:

```bash
mysql -u app_user -p -h localhost -D soccerdb
```

---

## Integración con MySQL Workbench

Para una administración visual:

1. Instalar MySQL Workbench:
   ```bash
   sudo apt install -y mysql-workbench
   ```
2. Conectarse al servidor local (`localhost`) con el usuario `app_user`.
3. Verificar acceso y crear esquemas, tablas y relaciones.

---

## Configuración de red y acceso remoto

Por defecto, MySQL solo escucha en `localhost`.  
Para habilitar acceso remoto (si se requiere para conexión desde el backend o la red local):

1. Editar el archivo de configuración:
   ```bash
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   ```
2. Buscar la línea:
   ```bash
   bind-address = 127.0.0.1
   ```
   y reemplazarla por:
   ```bash
   bind-address = 0.0.0.0
   ```
3. Reiniciar el servicio:
   ```bash
   sudo systemctl restart mysql
   ```
4. Verificar conectividad desde otro dispositivo o aplicación.

---

## Prueba de funcionamiento

Ejecutar en la consola MySQL:

```sql
SHOW DATABASES;
USE soccerdb;
SHOW TABLES;
```

Si las consultas se ejecutan correctamente, la instalación y configuración se realizaron de forma exitosa.

---

## Recomendaciones de seguridad

- Mantener MySQL actualizado con:
  ```bash
  sudo apt upgrade mysql-server
  ```
- Cambiar contraseñas periódicamente.
- Habilitar únicamente los puertos necesarios (3306).
- Realizar respaldos periódicos con `mysqldump`.

---

## Conclusión

El motor **MySQL Server 8.0** fue instalado y configurado correctamente en **Ubuntu Server 24.04**.  
La base de datos **soccerdb** quedó lista para la implementación del modelo físico, las relaciones, los procedimientos almacenados y las conexiones con el backend **Python**.  

**MySQL** cumple plenamente con los criterios de **rendimiento**, **estabilidad** y **compatibilidad** definidos para el proyecto **"Liga de Fútbol"**.

