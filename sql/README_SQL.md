# README_SQL.md

Proyecto: Liga de Fútbol  
Materia: Bases de Datos II  
Fase: Implementación del Modelo Físico  
Sistema Operativo: Ubuntu Server 24.04 (VirtualBox)  
Gestor de Base de Datos: MySQL 8.0  

---

Este documento describe el contenido y el propósito de los scripts SQL desarrollados para la implementación completa del proyecto de base de datos "Liga de Fútbol".  
El objetivo es documentar la creación, configuración y funcionamiento del modelo físico de la base de datos, así como las instrucciones para su ejecución e integración con la aplicación.

---

## Descripción general del sistema

El sistema de base de datos "Liga de Fútbol" fue diseñado para administrar la información de equipos, entrenadores, jugadores, estadios, temporadas, contratos, transferencias y estadísticas de partidos.  
Incluye automatizaciones mediante procedimientos almacenados y triggers, así como vistas que facilitan la consulta de información desde el backend o el frontend.

La base de datos se implementa en MySQL y se ejecuta en una máquina virtual con Ubuntu Server.  
El usuario principal de conexión para la aplicación es `app_user`.

---

## Estructura de scripts

01_creacion_tablas.sql  
Contiene las instrucciones para crear todas las tablas del modelo físico según el modelo relacional corregido.

02_relaciones.sql  
Define las claves foráneas, relaciones entre tablas, restricciones, validaciones y configuraciones de ON DELETE / ON UPDATE.

03_inserts.sql  
Inserta los datos iniciales de la base: equipos, jugadores, entrenadores, estadios, temporadas y registros de prueba.

04_procedimientos.sql  
Define los procedimientos almacenados que permiten automatizar tareas como registrar partidos, registrar transferencias, insertar jugadores y consultar la tabla de posiciones.

05_triggers.sql  
Incluye los triggers (disparadores) que se ejecutan automáticamente ante ciertas acciones, como actualizaciones de goles o movimientos de jugadores.

06_vistas.sql  
Crea vistas de consulta que simplifican la lectura de información: tabla de posiciones, jugadores con equipo y entrenador, nacionalidades, estadísticas y transferencias.

07_seguridad.sql  
Crea usuarios y roles de acceso (frontend, backend y administrador). Este script requiere ejecutarse con el usuario root.  
Su implementación es opcional pero recomendada para el control de acceso y la demostración académica.

README_SQL.md  
Documento de referencia que explica el uso, propósito y orden de los scripts.

---

## Orden recomendado de ejecución

1. Ejecutar el script 01_creacion_tablas.sql  
2. Ejecutar el script 02_relaciones.sql  
3. Ejecutar el script 03_inserts.sql  
4. Ejecutar el script 04_procedimientos.sql  
5. Ejecutar el script 05_triggers.sql  
6. Ejecutar el script 06_vistas.sql  
7. (Opcional) Ejecutar el script 07_seguridad.sql  

Todos los scripts deben ejecutarse en la base de datos "soccerdb".

---

## Base de datos y usuario principal

Creación de la base:

CREATE DATABASE soccerdb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

Usuario principal:

CREATE USER 'app_user'@'%' IDENTIFIED BY 'app_pass';  
GRANT ALL PRIVILEGES ON soccerdb.* TO 'app_user'@'%';  
FLUSH PRIVILEGES;

Este usuario es el que se utiliza para la conexión desde el backend y el frontend.

---

## Procedimientos principales

RegistrarPartido: Actualiza la tabla de posiciones según los resultados de los partidos.  
RegistrarTransferencia: Registra transferencias de jugadores y actualiza sus contratos.  
InsertarJugador: Inserta un jugador junto con su nacionalidad.  
ObtenerTablaPosiciones: Retorna las posiciones ordenadas por puntos y diferencia de goles.

---

## Triggers principales

trg_actualizar_tabla_posiciones: Actualiza automáticamente los goles a favor al insertar estadísticas.  
trg_log_transferencia: Registra automáticamente un duplicado histórico de una transferencia.  
trg_validar_contrato_unico: Evita que un jugador tenga más de un contrato activo.  
trg_actualizar_valor_jugador: Incrementa el valor de mercado de un jugador en un 10% después de una transferencia.

---

## Vistas incluidas

vista_tabla_posiciones: Muestra la tabla general de posiciones con nombre de equipo y temporada.  
vista_jugadores_equipo: Muestra los jugadores con su equipo y el entrenador actual.  
vista_jugadores_nacionalidad: Combina jugadores, nacionalidades y contratos.  
vista_estadisticas_jugadores: Muestra estadísticas de cada jugador por partido.  
vista_transferencias_recientes: Lista las transferencias realizadas más recientemente.

---

## Seguridad (opcional)

El script 07_seguridad.sql crea tres usuarios con diferentes permisos y roles:

frontend_user: Solo lectura (SELECT).  
backend_user: Lectura y escritura (SELECT, INSERT, UPDATE, DELETE, EXECUTE).  
admin_user: Acceso completo (ALL PRIVILEGES).  

Estos usuarios son opcionales y solo se deben crear con el usuario root, ya que requieren privilegios administrativos.

---

## Respaldo y restauración

Para crear un respaldo de la base de datos:

mysqldump -u root -p soccerdb > respaldo_soccerdb.sql

Para restaurar el respaldo:

mysql -u root -p soccerdb < respaldo_soccerdb.sql

---

## Conexión desde el backend

Ejemplo de conexión desde Python con Flask:

import mysql.connector

conexion = mysql.connector.connect(
    host="localhost",
    user="app_user",
    password="app_pass",
    database="soccerdb"
)

---

## Autores del proyecto

Santiago Yesid Tiusaba Aranda  
Juan Sebastian Morales Herrera  
Johan Sebastian Bonilla Gamez  

Proyecto final – Bases de Datos II  
Año 2025  

---

## Estado final

La base de datos "soccerdb" se encuentra completamente implementada, funcional y lista para integrarse con el backend y el frontend del proyecto "Liga de Fútbol".
