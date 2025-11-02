# Análisis de Selección de Sistema Operativo para el Proyecto "Liga de Fútbol"

## Introducción
Para la implementación de los motores de bases de datos del proyecto "Liga de Fútbol", se requiere un sistema operativo de tipo Unix o Linux, según los lineamientos establecidos por la asignatura de Bases de Datos II.  
El sistema operativo seleccionado debe ofrecer estabilidad, compatibilidad con motores relacionales y NoSQL, y facilidad de administración mediante línea de comandos.

## Sistema Operativo Seleccionado
Se seleccionó **Ubuntu Server 24.04 LTS (Long Term Support)** como sistema operativo principal para el proyecto.

## Justificación de la selección
1. **Compatibilidad**  
   Ubuntu Server es ampliamente compatible con los principales motores de bases de datos, incluyendo **MySQL**, **PostgreSQL**, **MariaDB** y **MongoDB**.
2. **Rendimiento y estabilidad**  
   La versión LTS ofrece soporte prolongado (5 años) y optimización para entornos de servidor, garantizando estabilidad para los servicios de bases de datos.
3. **Seguridad**  
   Ubuntu cuenta con actualizaciones automáticas de seguridad, soporte para `ufw` (firewall), y autenticación basada en usuarios privilegiados.
4. **Comunidad y soporte**  
   Ubuntu es una de las distribuciones Linux con mayor comunidad activa, lo que facilita encontrar documentación, foros y soluciones.
5. **Facilidad de uso**  
   Permite una administración sencilla desde la terminal, con comandos intuitivos (`apt install`, `systemctl`, `nano`, etc.).

## Conclusión
Ubuntu Server 24.04 LTS cumple con los requisitos académicos, técnicos y de seguridad del proyecto.  
Se utilizará como base para instalar y administrar los motores **MySQL** (relacional) y **MongoDB** (NoSQL).
