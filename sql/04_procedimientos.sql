-- ======================================================
-- PROYECTO: LIGA DE FÚTBOL
-- SCRIPT: PROCEDIMIENTOS ALMACENADOS
-- BASE DE DATOS: soccerdb
-- ======================================================

USE soccerdb;

-- ======================================================
-- 1️⃣ PROCEDIMIENTO: Registrar un partido jugado
-- ======================================================
-- Este procedimiento actualiza el estado del partido y registra los resultados
-- en la tabla de posiciones según los goles ingresados.

DELIMITER //
CREATE PROCEDURE RegistrarPartido(
    IN p_id_partido INT,
    IN p_id_local INT,
    IN p_id_visitante INT,
    IN p_id_temporada INT,
    IN p_goles_local INT,
    IN p_goles_visitante INT
)
BEGIN
    DECLARE v_puntos_local INT DEFAULT 0;
    DECLARE v_puntos_visitante INT DEFAULT 0;

    -- Calcular puntos según el resultado
    IF p_goles_local > p_goles_visitante THEN
        SET v_puntos_local = 3;
        SET v_puntos_visitante = 0;
    ELSEIF p_goles_local = p_goles_visitante THEN
        SET v_puntos_local = 1;
        SET v_puntos_visitante = 1;
    ELSE
        SET v_puntos_local = 0;
        SET v_puntos_visitante = 3;
    END IF;

    -- Actualizar la tabla de posiciones para el equipo local
    UPDATE TABLA_POSICIONES
    SET 
        partidos_jugados = partidos_jugados + 1,
        ganados = ganados + (v_puntos_local = 3),
        empatados = empatados + (v_puntos_local = 1),
        perdidos = perdidos + (v_puntos_local = 0),
        goles_favor = goles_favor + p_goles_local,
        goles_contra = goles_contra + p_goles_visitante,
        puntos = puntos + v_puntos_local
    WHERE id_equipo = p_id_local AND id_temporada = p_id_temporada;

    -- Actualizar la tabla de posiciones para el equipo visitante
    UPDATE TABLA_POSICIONES
    SET 
        partidos_jugados = partidos_jugados + 1,
        ganados = ganados + (v_puntos_visitante = 3),
        empatados = empatados + (v_puntos_visitante = 1),
        perdidos = perdidos + (v_puntos_visitante = 0),
        goles_favor = goles_favor + p_goles_visitante,
        goles_contra = goles_contra + p_goles_local,
        puntos = puntos + v_puntos_visitante
    WHERE id_equipo = p_id_visitante AND id_temporada = p_id_temporada;

    -- Marcar partido como finalizado
    UPDATE PARTIDO
    SET estado = 'Finalizado'
    WHERE id_partido = p_id_partido;
END //
DELIMITER ;

-- ======================================================
-- 2️⃣ PROCEDIMIENTO: Registrar una transferencia
-- ======================================================
-- Mueve un jugador de un equipo origen a uno destino y actualiza la tabla CONTRATO.

DELIMITER //
CREATE PROCEDURE RegistrarTransferencia(
    IN p_id_jugador INT,
    IN p_id_equipo_origen INT,
    IN p_id_equipo_destino INT,
    IN p_valor_transferencia DECIMAL(15,2),
    IN p_tipo VARCHAR(50)
)
BEGIN
    DECLARE v_fecha DATE DEFAULT NOW();

    -- Registrar transferencia
    INSERT INTO TRANSFERENCIA (
        id_jugador, id_equipo_origen, id_equipo_destino, fecha_transferencia, valor_transferencia, tipo_transferencia, estado
    ) VALUES (
        p_id_jugador, p_id_equipo_origen, p_id_equipo_destino, v_fecha, p_valor_transferencia, p_tipo, 'Completada'
    );

    -- Actualizar contrato del jugador
    UPDATE CONTRATO
    SET id_equipo = p_id_equipo_destino,
        fecha_inicio = v_fecha,
        fecha_fin = DATE_ADD(v_fecha, INTERVAL 1 YEAR)
    WHERE id_jugador = p_id_jugador;
END //
DELIMITER ;

-- ======================================================
-- 3️⃣ PROCEDIMIENTO: Insertar jugador con nacionalidad
-- ======================================================
-- Inserta un nuevo jugador y su nacionalidad asociada.

DELIMITER //
CREATE PROCEDURE InsertarJugador(
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_fecha_nacimiento DATE,
    IN p_posicion VARCHAR(50),
    IN p_valor_mercado DECIMAL(12,2),
    IN p_dorsal INT,
    IN p_estado VARCHAR(50),
    IN p_nacionalidad VARCHAR(50)
)
BEGIN
    DECLARE v_id_jugador INT;

    -- Insertar jugador
    INSERT INTO JUGADOR (nombre, apellido, fecha_nacimiento, posicion, valor_mercado, dorsal, estado)
    VALUES (p_nombre, p_apellido, p_fecha_nacimiento, p_posicion, p_valor_mercado, p_dorsal, p_estado);

    -- Obtener el ID del nuevo jugador
    SET v_id_jugador = LAST_INSERT_ID();

    -- Insertar nacionalidad
    INSERT INTO JUGADOR_NACIONALIDAD (id_jugador, nacionalidad)
    VALUES (v_id_jugador, p_nacionalidad);
END //
DELIMITER ;

-- ======================================================
-- 4️⃣ PROCEDIMIENTO: Consultar tabla de posiciones
-- ======================================================
-- Devuelve la tabla de posiciones ordenada por puntos y diferencia de goles.

DELIMITER //
CREATE PROCEDURE ObtenerTablaPosiciones(IN p_id_temporada INT)
BEGIN
    SELECT 
        e.nombre AS Equipo,
        tp.puntos,
        tp.partidos_jugados,
        tp.ganados,
        tp.empatados,
        tp.perdidos,
        tp.goles_favor,
        tp.goles_contra,
        (tp.goles_favor - tp.goles_contra) AS diferencia_goles
    FROM TABLA_POSICIONES tp
    INNER JOIN EQUIPO e ON e.id_equipo = tp.id_equipo
    WHERE tp.id_temporada = p_id_temporada
    ORDER BY tp.puntos DESC, diferencia_goles DESC;
END //
DELIMITER ;
