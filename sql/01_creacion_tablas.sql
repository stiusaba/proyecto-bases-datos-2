use soccerdb;

-- ======================================================
-- PROYECTO: LIGA DE FÚTBOL
-- SCRIPT: CREACIÓN DE TABLAS (MODELO RELACIONAL CORREGIDO)
-- BASE DE DATOS: soccerdb
-- ======================================================

-- =====================
-- TABLA: ESTADIO
-- =====================
CREATE TABLE ESTADIO (
  id_estadio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  ciudad VARCHAR(100),
  direccion VARCHAR(200),
  capacidad INT
) ENGINE=InnoDB;

-- =====================
-- TABLA: EQUIPO
-- =====================
CREATE TABLE EQUIPO (
  id_equipo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  ciudad VARCHAR(100),
  presupuesto DECIMAL(15,2),
  escudo VARCHAR(255),
  contacto_email VARCHAR(150)
) ENGINE=InnoDB;

-- =====================
-- TABLA: EQUIPO_TELEFONO
-- =====================
CREATE TABLE EQUIPO_TELEFONO (
  id_equipo_telefono INT AUTO_INCREMENT PRIMARY KEY,
  id_equipo INT NOT NULL,
  telefono VARCHAR(20),
  tipo VARCHAR(50),
  FOREIGN KEY (id_equipo) REFERENCES EQUIPO(id_equipo)
) ENGINE=InnoDB;

-- =====================
-- TABLA: ENTRENADOR
-- =====================
CREATE TABLE ENTRENADOR (
  id_entrenador INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  nacionalidad VARCHAR(50),
  anos_experiencia INT
) ENGINE=InnoDB;

-- =====================
-- TABLA: EQUIPO_ENTRENADOR
-- =====================
CREATE TABLE EQUIPO_ENTRENADOR (
  id_equipo_entrenador INT AUTO_INCREMENT PRIMARY KEY,
  id_equipo INT NOT NULL,
  id_entrenador INT NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  es_actual BOOLEAN,
  FOREIGN KEY (id_equipo) REFERENCES EQUIPO(id_equipo),
  FOREIGN KEY (id_entrenador) REFERENCES ENTRENADOR(id_entrenador)
) ENGINE=InnoDB;

-- =====================
-- TABLA: TEMPORADA
-- =====================
CREATE TABLE TEMPORADA (
  id_temporada INT AUTO_INCREMENT PRIMARY KEY,
  ano_inicio YEAR NOT NULL,
  ano_fin YEAR NOT NULL,
  nombre_competicion VARCHAR(150)
) ENGINE=InnoDB;

-- =====================
-- TABLA: JUGADOR
-- =====================
CREATE TABLE JUGADOR (
  id_jugador INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  fecha_nacimiento DATE,
  posicion VARCHAR(50),
  valor_mercado DECIMAL(12,2),
  dorsal INT,
  estado VARCHAR(50)
) ENGINE=InnoDB;

-- =====================
-- TABLA: JUGADOR_NACIONALIDAD
-- =====================
CREATE TABLE JUGADOR_NACIONALIDAD (
  id_jn INT AUTO_INCREMENT PRIMARY KEY,
  id_jugador INT NOT NULL,
  nacionalidad VARCHAR(50),
  FOREIGN KEY (id_jugador) REFERENCES JUGADOR(id_jugador)
) ENGINE=InnoDB;

-- =====================
-- TABLA: CONTRATO
-- =====================
CREATE TABLE CONTRATO (
  id_contrato INT AUTO_INCREMENT PRIMARY KEY,
  id_jugador INT NOT NULL,
  id_equipo INT NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  salario_anual DECIMAL(14,2),
  clausula_rescision DECIMAL(14,2),
  FOREIGN KEY (id_jugador) REFERENCES JUGADOR(id_jugador),
  FOREIGN KEY (id_equipo) REFERENCES EQUIPO(id_equipo)
) ENGINE=InnoDB;

-- =====================
-- TABLA: PARTIDO
-- =====================
CREATE TABLE PARTIDO (
  id_partido INT AUTO_INCREMENT PRIMARY KEY,
  fecha_hora DATETIME NOT NULL,
  jornada INT,
  estado VARCHAR(50),
  id_estadio INT,
  FOREIGN KEY (id_estadio) REFERENCES ESTADIO(id_estadio)
) ENGINE=InnoDB;

-- =====================
-- TABLA: ESTADISTICA
-- =====================
CREATE TABLE ESTADISTICA (
  id_estadistica INT AUTO_INCREMENT PRIMARY KEY,
  id_partido INT NOT NULL,
  id_jugador INT NOT NULL,
  goles INT DEFAULT 0,
  asistencias INT DEFAULT 0,
  tarjetas_amarillas INT DEFAULT 0,
  tarjetas_rojas INT DEFAULT 0,
  FOREIGN KEY (id_partido) REFERENCES PARTIDO(id_partido),
  FOREIGN KEY (id_jugador) REFERENCES JUGADOR(id_jugador)
) ENGINE=InnoDB;

-- =====================
-- TABLA: TRANSFERENCIA
-- =====================
CREATE TABLE TRANSFERENCIA (
  id_transferencia INT AUTO_INCREMENT PRIMARY KEY,
  id_jugador INT NOT NULL,
  id_equipo_origen INT,
  id_equipo_destino INT,
  fecha_transferencia DATE,
  valor_transferencia DECIMAL(15,2),
  tipo_transferencia VARCHAR(50),
  estado VARCHAR(50),
  FOREIGN KEY (id_jugador) REFERENCES JUGADOR(id_jugador),
  FOREIGN KEY (id_equipo_origen) REFERENCES EQUIPO(id_equipo),
  FOREIGN KEY (id_equipo_destino) REFERENCES EQUIPO(id_equipo)
) ENGINE=InnoDB;

-- =====================
-- TABLA: TABLA_POSICIONES
-- =====================
CREATE TABLE TABLA_POSICIONES (
  id_temporada INT NOT NULL,
  id_equipo INT NOT NULL,
  puntos INT DEFAULT 0,
  partidos_jugados INT DEFAULT 0,
  ganados INT DEFAULT 0,
  empatados INT DEFAULT 0,
  perdidos INT DEFAULT 0,
  goles_favor INT DEFAULT 0,
  goles_contra INT DEFAULT 0,
  diferencia_goles INT GENERATED ALWAYS AS (goles_favor - goles_contra) STORED,
  PRIMARY KEY (id_temporada, id_equipo),
  FOREIGN KEY (id_temporada) REFERENCES TEMPORADA(id_temporada),
  FOREIGN KEY (id_equipo) REFERENCES EQUIPO(id_equipo)
) ENGINE=InnoDB;