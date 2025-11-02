-- ======================================================
-- PROYECTO: LIGA DE FÚTBOL
-- SCRIPT: CONFIGURACIÓN DE USUARIOS Y ROLES
-- BASE DE DATOS: soccerdb
-- ======================================================
USE soccerdb;
-- ======================================================
-- 1 CREAR ROLES (agrupadores de permisos)
-- ======================================================

-- Rol de solo lectura (para frontend)
CREATE ROLE IF NOT EXISTS rol_lectura;

-- Rol de lectura y escritura (para backend / API)
CREATE ROLE IF NOT EXISTS rol_edicion;

-- Rol de administración total (para el DBA o profesor)
CREATE ROLE IF NOT EXISTS rol_admin;

-- ======================================================
-- 2 ASIGNAR PRIVILEGIOS A LOS ROLES
-- ======================================================

-- Permisos de solo lectura
GRANT SELECT ON soccerdb.* TO rol_lectura;

-- Permisos de lectura + escritura (sin eliminar estructuras)
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON soccerdb.* TO rol_edicion;

-- Permisos totales (todo, incluido crear y modificar objetos)
GRANT ALL PRIVILEGES ON soccerdb.* TO rol_admin;

-- ======================================================
-- 3 CREAR USUARIOS DEL PROYECTO
-- ======================================================

-- Usuario del FRONTEND (solo lectura)
CREATE USER IF NOT EXISTS 'frontend_user'@'%' IDENTIFIED BY 'Front123$';

-- Usuario del BACKEND (puede modificar datos, pero no estructuras)
CREATE USER IF NOT EXISTS 'backend_user'@'%' IDENTIFIED BY 'Back123$';

-- Usuario ADMIN (control total)
CREATE USER IF NOT EXISTS 'admin_user'@'localhost' IDENTIFIED BY 'Admin123$';

-- ======================================================
-- 4 ASIGNAR ROLES A CADA USUARIO
-- ======================================================

GRANT rol_lectura TO 'frontend_user'@'%';
GRANT rol_edicion TO 'backend_user'@'%';
GRANT rol_admin TO 'admin_user'@'localhost';

-- ======================================================
-- 5 ACTIVAR LOS ROLES POR DEFECTO
-- ======================================================

SET DEFAULT ROLE rol_lectura TO 'frontend_user'@'%';
SET DEFAULT ROLE rol_edicion TO 'backend_user'@'%';
SET DEFAULT ROLE rol_admin TO 'admin_user'@'localhost';

-- ======================================================
-- 6 APLICAR CAMBIOS
-- ======================================================
FLUSH PRIVILEGES;
