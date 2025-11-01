-- ======================================================
-- PROYECTO: LIGA DE FÚTBOL
-- SCRIPT: INSERCIÓN DE DATOS DE EJEMPLO
-- BASE DE DATOS: soccerdb
-- ======================================================

USE soccerdb;

-- ======================================================
-- 1. ESTADIOS
-- ======================================================
INSERT INTO ESTADIO (nombre, ciudad, direccion, capacidad) VALUES
('Estadio Nacional', 'Bogotá', 'Av. 68 # 90-45', 40000),
('Estadio Metropolitano', 'Barranquilla', 'Cra 57 # 72-89', 46000),
('Estadio Atanasio Girardot', 'Medellín', 'Cl. 50 # 73-10', 42000),
('Estadio Pascual Guerrero', 'Cali', 'Av. Roosevelt # 34-00', 38000);

-- ======================================================
-- 2. EQUIPOS
-- ======================================================
INSERT INTO EQUIPO (nombre, ciudad, presupuesto, escudo, contacto_email) VALUES
('Santa Fe FC', 'Bogotá', 8500000, 'escudo_santafe.png', 'contacto@santafe.com'),
('Junior FC', 'Barranquilla', 9200000, 'escudo_junior.png', 'info@juniorfc.com'),
('Nacional FC', 'Medellín', 11000000, 'escudo_nacional.png', 'contacto@nacional.com'),
('Deportivo Cali', 'Cali', 8700000, 'escudo_cali.png', 'contacto@deportivocali.com');

-- ======================================================
-- 3. EQUIPO_TELEFONO
-- ======================================================
INSERT INTO EQUIPO_TELEFONO (id_equipo, telefono, tipo) VALUES
(1, '6015551111', 'Oficina'),
(1, '3001234567', 'Móvil'),
(2, '6057772233', 'Oficina'),
(3, '6044446677', 'Oficina'),
(4, '6028889900', 'Oficina');

-- ======================================================
-- 4. ENTRENADORES
-- ======================================================
INSERT INTO ENTRENADOR (nombre, apellido, nacionalidad, anos_experiencia) VALUES
('Hernán', 'Torres', 'Colombiana', 12),
('Luis', 'Amaranto Perea', 'Colombiana', 6),
('Paulo', 'Autuori', 'Brasileña', 18),
('Rafael', 'Dudamel', 'Venezolana', 10);

-- ======================================================
-- 5. EQUIPO_ENTRENADOR
-- ======================================================
INSERT INTO EQUIPO_ENTRENADOR (id_equipo, id_entrenador, fecha_inicio, es_actual) VALUES
(1, 1, '2025-01-01', TRUE),
(2, 2, '2025-01-01', TRUE),
(3, 3, '2025-01-01', TRUE),
(4, 4, '2025-01-01', TRUE);

-- ======================================================
-- 6. TEMPORADAS
-- ======================================================
INSERT INTO TEMPORADA (ano_inicio, ano_fin, nombre_competicion) VALUES
(2025, 2026, 'Liga Colombiana A 2025-26'),
(2025, 2025, 'Copa Colombia 2025');

-- ======================================================
-- 7. JUGADORES
-- ======================================================
INSERT INTO JUGADOR (nombre, apellido, fecha_nacimiento, posicion, valor_mercado, dorsal, estado) VALUES
('Andrés', 'Gómez', '1998-03-10', 'Delantero', 1500000, 9, 'Activo'),
('Juan', 'Rodríguez', '1995-07-22', 'Defensa', 950000, 4, 'Activo'),
('Carlos', 'Mendoza', '2000-01-15', 'Mediocampista', 1200000, 10, 'Activo'),
('Luis', 'Vargas', '1997-11-09', 'Portero', 1100000, 1, 'Activo'),
('Felipe', 'Rincón', '1999-05-04', 'Delantero', 1400000, 11, 'Activo');

-- ======================================================
-- 8. JUGADOR_NACIONALIDAD
-- ======================================================
INSERT INTO JUGADOR_NACIONALIDAD (id_jugador, nacionalidad) VALUES
(1, 'Colombiana'),
(2, 'Colombiana'),
(3, 'Uruguaya'),
(4, 'Colombiana'),
(5, 'Ecuatoriana');

-- ======================================================
-- 9. CONTRATOS
-- ======================================================
INSERT INTO CONTRATO (id_jugador, id_equipo, fecha_inicio, fecha_fin, salario_anual, clausula_rescision) VALUES
(1, 1, '2025-01-01', '2026-12-31', 750000, 2000000),
(2, 2, '2025-01-01', '2026-12-31', 550000, 1500000),
(3, 3, '2025-01-01', '2026-12-31', 650000, 1800000),
(4, 4, '2025-01-01', '2026-12-31', 600000, 1700000),
(5, 1, '2025-01-01', '2026-12-31', 580000, 1300000);

-- ======================================================
-- 10. PARTIDOS
-- ======================================================
INSERT INTO PARTIDO (fecha_hora, jornada, estado, id_estadio) VALUES
('2025-02-15 16:00:00', 1, 'Finalizado', 1),
('2025-02-16 18:00:00', 1, 'Finalizado', 2),
('2025-02-22 17:00:00', 2, 'Programado', 3),
('2025-02-23 19:00:00', 2, 'Programado', 4);

-- ======================================================
-- 11. ESTADISTICAS DE JUGADORES
-- ======================================================
INSERT INTO ESTADISTICA (id_partido, id_jugador, goles, asistencias, tarjetas_amarillas, tarjetas_rojas) VALUES
(1, 1, 2, 0, 0, 0),
(1, 3, 0, 1, 1, 0),
(2, 2, 1, 0, 0, 0),
(2, 5, 0, 0, 0, 0);

-- ======================================================
-- 12. TRANSFERENCIAS
-- ======================================================
INSERT INTO TRANSFERENCIA (id_jugador, id_equipo_origen, id_equipo_destino, fecha_transferencia, valor_transferencia, tipo_transferencia, estado) VALUES
(1, 1, 3, '2025-06-10', 2000000, 'Traspaso', 'Completada'),
(5, 4, 2, '2025-07-05', 1800000, 'Cesión', 'Pendiente');

-- ======================================================
-- 13. TABLA DE POSICIONES (TEMPORADA 2025)
-- ======================================================
INSERT INTO TABLA_POSICIONES (id_temporada, id_equipo, puntos, partidos_jugados, ganados, empatados, perdidos, goles_favor, goles_contra)
VALUES
(1, 1, 3, 1, 1, 0, 0, 2, 1),
(1, 2, 1, 1, 0, 1, 0, 1, 1),
(1, 3, 0, 0, 0, 0, 0, 0, 0),
(1, 4, 0, 0, 0, 0, 0, 0, 0);
