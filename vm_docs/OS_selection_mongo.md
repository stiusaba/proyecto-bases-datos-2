# Análisis de Selección de Sistema Operativo para MongoDB  
Proyecto: Liga de Fútbol  

## Introducción
Para la implementación del motor de base de datos NoSQL **MongoDB**, el proyecto "Liga de Fútbol" debe utilizar un sistema operativo basado en **Linux o Unix**, según los lineamientos establecidos en los entregables del curso de Bases de Datos II.  

El sistema operativo debe garantizar compatibilidad con MongoDB, estabilidad, facilidad de administración y soporte a largo plazo.

---

## Sistema operativo seleccionado
El sistema operativo elegido para la instalación de MongoDB es **Ubuntu Server 24.04 LTS (Long Term Support)**, la misma distribución utilizada para el motor relacional **MySQL**.

---

## Justificación de la selección

1. **Compatibilidad nativa**  
   MongoDB cuenta con soporte oficial para Ubuntu LTS y se distribuye directamente desde los repositorios oficiales de MongoDB, asegurando una instalación sencilla y estable.

2. **Unificación del entorno de trabajo**  
   Se utilizará la **misma máquina virtual** que aloja MySQL, optimizando los recursos del servidor y reduciendo la complejidad de administración.

3. **Seguridad y estabilidad**  
   Ubuntu Server es ampliamente reconocido por su estabilidad, actualizaciones constantes y herramientas de seguridad como `ufw` (firewall) y `AppArmor`.

4. **Rendimiento**  
   Está optimizado para entornos de servidor, ofreciendo un excelente rendimiento con bases de datos de gran tamaño o múltiples conexiones simultáneas.

5. **Compatibilidad con Python y el backend del proyecto**  
   Ubuntu Server permite una integración directa con las librerías `pymongo` y `mysql.connector`, utilizadas en la aplicación web para conectar los motores de base de datos.

6. **Cumplimiento de los requisitos del proyecto**  
   Satisface la exigencia académica de usar un sistema operativo basado en Linux o Unix tanto para la base relacional como para la NoSQL.

---

## Ventajas del uso de Ubuntu Server para MongoDB

- Instalación simplificada mediante repositorios oficiales.  
- Soporte extendido (LTS) hasta 2034.  
- Mantenimiento sencillo y actualizaciones automáticas.  
- Comunidad activa y documentación abundante.  
- Compatible con entornos virtualizados y contenedores.

---

## Requerimientos mínimos para el entorno MongoDB

| Recurso | Valor mínimo recomendado |
|----------|--------------------------|
| Procesador | 2 núcleos |
| Memoria RAM | 4 GB |
| Almacenamiento | 20 GB |
| Sistema de archivos | ext4 |
| Red | NAT + Adaptador puente |

---

## Conclusión
El sistema operativo **Ubuntu Server 24.04 LTS** fue seleccionado para la instalación del motor NoSQL **MongoDB**, ya que cumple con los requisitos técnicos, académicos y de compatibilidad del proyecto.  
La decisión de utilizar la misma máquina virtual que alberga MySQL permite aprovechar mejor los recursos del sistema, simplificar la gestión y mantener un entorno de desarrollo unificado para el proyecto **"Liga de Fútbol"**.
