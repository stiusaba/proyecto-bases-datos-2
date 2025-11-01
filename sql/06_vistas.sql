-- ======================================================
-- PROYECTO: LIGA DE FÚTBOL
-- SCRIPT: VISTAS DEL SISTEMA
-- BASE DE DATOS: soccerdb
-- ======================================================

USE soccerdb;

-- ======================================================
-- 1 VISTA: Tabla de posiciones general (CORREGIDA)
-- ======================================================
CREATE OR REPLACE VIEW vista_tabla_posiciones AS
SELECT 
    t.id_temporada,
    t.nombre_competicion AS temporada,
    e.nombre AS equipo,
    tp.puntos,
    tp.partidos_jugados,
    tp.ganados,
    tp.empatados,
    tp.perdidos,
    tp.goles_favor,
    tp.goles_contra,
    (tp.goles_favor - tp.goles_contra) AS diferencia_goles
FROM TABLA_POSICIONES tp
JOIN EQUIPO e ON e.id_equipo = tp.id_equipo
JOIN TEMPORADA t ON t.id_temporada = tp.id_temporada
ORDER BY tp.puntos DESC, diferencia_goles DESC;

-- ======================================================
-- 2 VISTA: Jugadores con su equipo y entrenador actual
-- ======================================================
CREATE OR REPLACE VIEW vista_jugadores_equipo AS
SELECT 
    j.id_jugador,
    CONCAT(j.nombre, ' ', j.apellido) AS jugador,
    j.posicion,
    j.valor_mercado,
    e.nombre AS equipo,
    en.nombre AS entrenador,
    en.apellido AS entrenador_apellido
FROM JUGADOR j
JOIN CONTRATO c ON c.id_jugador = j.id_jugador
JOIN EQUIPO e ON e.id_equipo = c.id_equipo
JOIN EQUIPO_ENTRENADOR ee ON ee.id_equipo = e.id_equipo AND ee.es_actual = TRUE
JOIN ENTRENADOR en ON en.id_entrenador = ee.id_entrenador;

-- ======================================================
-- 3 VISTA: Jugadores con nacionalidad y estado de contrato
-- ======================================================
CREATE OR REPLACE VIEW vista_jugadores_nacionalidad AS
SELECT 
    j.id_jugador,
    CONCAT(j.nombre, ' ', j.apellido) AS jugador,
    j.posicion,
    j.estado,
    jn.nacionalidad,
    e.nombre AS equipo,
    c.fecha_fin AS contrato_vigente_hasta
FROM JUGADOR j
LEFT JOIN JUGADOR_NACIONALIDAD jn ON jn.id_jugador = j.id_jugador
LEFT JOIN CONTRATO c ON c.id_jugador = j.id_jugador
LEFT JOIN EQUIPO e ON e.id_equipo = c.id_equipo;

-- ======================================================
-- 4 VISTA: Estadísticas de jugadores por partido
-- ======================================================
CREATE OR REPLACE VIEW vista_estadisticas_jugadores AS
SELECT 
    p.id_partido,
    DATE(p.fecha_hora) AS fecha,
    e.nombre AS estadio,
    j.nombre AS jugador,
    j.posicion,
    es.goles,
    es.asistencias,
    es.tarjetas_amarillas,
    es.tarjetas_rojas
FROM ESTADISTICA es
JOIN JUGADOR j ON j.id_jugador = es.id_jugador
JOIN PARTIDO p ON p.id_partido = es.id_partido
JOIN ESTADIO e ON e.id_estadio = p.id_estadio
ORDER BY p.fecha_hora ASC;

-- ======================================================
--5 VISTA: Transferencias recientes
-- ======================================================
CREATE OR REPLACE VIEW vista_transferencias_recientes AS
SELECT 
    t.id_transferencia,
    j.nombre AS jugador,
    e1.nombre AS equipo_origen,
    e2.nombre AS equipo_destino,
    t.valor_transferencia,
    t.tipo_transferencia,
    t.estado,
    DATE(t.fecha_transferencia) AS fecha
FROM TRANSFERENCIA t
JOIN JUGADOR j ON j.id_jugador = t.id_jugador
LEFT JOIN EQUIPO e1 ON e1.id_equipo = t.id_equipo_origen
LEFT JOIN EQUIPO e2 ON e2.id_equipo = t.id_equipo_destino
ORDER BY t.fecha_transferencia DESC;
