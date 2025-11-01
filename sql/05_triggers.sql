-- ======================================================
-- PROYECTO: LIGA DE FÚTBOL
-- SCRIPT: TRIGGERS (DISPARADORES)
-- BASE DE DATOS: soccerdb
-- ======================================================

USE soccerdb;

-- ======================================================
-- 1 TRIGGER: Actualizar la tabla de posiciones al insertar una estadística
-- ======================================================
-- Este trigger suma goles a favor/en contra y puntos automáticamente
-- cuando se insertan registros en la tabla ESTADISTICA.

DELIMITER //
CREATE TRIGGER trg_actualizar_tabla_posiciones
AFTER INSERT ON ESTADISTICA
FOR EACH ROW
BEGIN
    DECLARE v_id_partido INT;
    DECLARE v_id_jugador INT;
    DECLARE v_id_equipo INT;
    DECLARE v_id_temporada INT;
    DECLARE v_goles_local INT DEFAULT 0;
    DECLARE v_goles_visitante INT DEFAULT 0;

    -- Obtener IDs del partido y jugador
    SET v_id_partido = NEW.id_partido;
    SET v_id_jugador = NEW.id_jugador;

    -- Encontrar el equipo del jugador
    SELECT c.id_equipo INTO v_id_equipo
    FROM CONTRATO c
    WHERE c.id_jugador = v_id_jugador
    ORDER BY c.fecha_inicio DESC
    LIMIT 1;

    -- Buscar la temporada actual (última registrada)
    SELECT id_temporada INTO v_id_temporada
    FROM TEMPORADA
    ORDER BY id_temporada DESC
    LIMIT 1;

    -- Si el jugador marcó goles, actualiza sus goles_favor
    IF NEW.goles > 0 THEN
        UPDATE TABLA_POSICIONES
        SET goles_favor = goles_favor + NEW.goles
        WHERE id_equipo = v_id_equipo AND id_temporada = v_id_temporada;
    END IF;
END //
DELIMITER ;

-- ======================================================
-- 2 TRIGGER: Registrar automáticamente una transferencia en log
-- ======================================================
-- Crea un registro histórico cada vez que se inserta una transferencia.

DELIMITER //
CREATE TRIGGER trg_log_transferencia
AFTER INSERT ON TRANSFERENCIA
FOR EACH ROW
BEGIN
    INSERT INTO TRANSFERENCIA (
        id_jugador, id_equipo_origen, id_equipo_destino,
        fecha_transferencia, valor_transferencia,
        tipo_transferencia, estado
    )
    VALUES (
        NEW.id_jugador, NEW.id_equipo_origen, NEW.id_equipo_destino,
        NOW(), NEW.valor_transferencia, NEW.tipo_transferencia, 'Histórico'
    );
END //
DELIMITER ;

-- ======================================================
-- 3 TRIGGER: Evitar contratos duplicados para el mismo jugador
-- ======================================================
-- Si un jugador intenta firmar un nuevo contrato mientras tiene uno activo,
-- se lanza un error.

DELIMITER //
CREATE TRIGGER trg_validar_contrato_unico
BEFORE INSERT ON CONTRATO
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM CONTRATO
        WHERE id_jugador = NEW.id_jugador
        AND fecha_fin >= CURDATE()
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: el jugador ya tiene un contrato activo.';
    END IF;
END //
DELIMITER ;

-- ======================================================
-- 4 TRIGGER: Actualizar valor de mercado tras una transferencia
-- ======================================================
-- Cada vez que se registra una transferencia, el valor del jugador aumenta 10%.

DELIMITER //
CREATE TRIGGER trg_actualizar_valor_jugador
AFTER INSERT ON TRANSFERENCIA
FOR EACH ROW
BEGIN
    UPDATE JUGADOR
    SET valor_mercado = valor_mercado * 1.10
    WHERE id_jugador = NEW.id_jugador;
END //
DELIMITER ;
