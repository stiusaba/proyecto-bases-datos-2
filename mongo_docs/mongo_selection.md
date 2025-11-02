# Análisis de Selección del Motor de Base de Datos NoSQL – MongoDB  
Proyecto: Liga de Fútbol  

## Introducción
El proyecto **"Liga de Fútbol"** requiere la integración de un motor de base de datos NoSQL que complemente el modelo relacional ya implementado en MySQL.  
El sistema NoSQL se utilizará para manejar información semiestructurada, documentos dinámicos y registros históricos, los cuales no son óptimos para almacenarse en un esquema relacional tradicional.  

---

## Criterios de selección
Para determinar el motor NoSQL más adecuado, se analizaron los siguientes criterios técnicos:

1. **Modelo de almacenamiento**  
   Se busca un motor documental que permita manejar estructuras JSON, adecuadas para representar jugadores, estadísticas o transferencias.

2. **Compatibilidad con Ubuntu Server 24.04**  
   El motor debe funcionar correctamente en entornos Linux sin necesidad de configuraciones complejas.

3. **Integración con el backend Python**  
   El proyecto utiliza un backend en Python, por lo que el motor debe contar con controladores oficiales compatibles (como `pymongo`).

4. **Escalabilidad y rendimiento**  
   El motor debe permitir almacenar grandes volúmenes de información con tiempos de respuesta rápidos y posibilidad de crecimiento horizontal.

5. **Licencia y soporte**  
   Debe ser de código abierto, gratuito y contar con documentación actualizada y soporte de comunidad.

---

## Motores analizados

### 1. **MongoDB**
- Modelo de datos: Documental (JSON/BSON)  
- Lenguaje de consultas: Propio basado en JSON  
- Escalabilidad: Alta (sharding y replicación)  
- Integración: Nativa con Python mediante `pymongo`  
- Soporte oficial para Ubuntu  
- Comunidad amplia y activa  

### 2. **Cassandra**
- Modelo de datos: Columna ancha  
- Rendimiento alto en escritura, pero menos flexible para consultas ad-hoc  
- Requiere mayor configuración para entornos pequeños  
- Menor compatibilidad con estructuras JSON  

### 3. **CouchDB**
- Modelo de datos: Documental  
- Integración nativa con REST, pero menor rendimiento en operaciones complejas  
- Comunidad más pequeña que MongoDB  

---

## Motor seleccionado: MongoDB

Después del análisis comparativo, se selecciona **MongoDB** como motor de base de datos NoSQL para el proyecto.

### Justificación de la elección

1. **Modelo documental flexible**  
   MongoDB permite almacenar documentos en formato JSON, adaptándose fácilmente a estructuras variables (por ejemplo, estadísticas de jugadores que no siempre contienen los mismos campos).

2. **Integración con el backend**  
   Soporta conexión directa desde Python con la librería `pymongo`, lo que facilita el desarrollo del backend en Flask.

3. **Escalabilidad horizontal**  
   MongoDB permite distribuir los datos entre varios servidores mediante técnicas de *sharding* y *replicación*.

4. **Instalación y mantenimiento sencillos**  
   Cuenta con repositorios oficiales para Ubuntu, instalación rápida y herramientas visuales como **MongoDB Compass** para la administración.

5. **Rendimiento óptimo para lectura y escritura**  
   Gracias al formato BSON y a su estructura indexada, MongoDB ofrece alto rendimiento en operaciones de inserción y consulta.

6. **Amplia documentación y soporte**  
   La comunidad de MongoDB es una de las más grandes del ecosistema NoSQL, lo que garantiza continuidad y actualizaciones.

---

## Aplicación dentro del proyecto
En el contexto del proyecto "Liga de Fútbol", el componente **MongoDB** se implementará para gestionar información **no estructurada o semiestructurada** relacionada con el sistema de **noticias y contenido multimedia**.  

Su función principal será almacenar y administrar datos de cambio frecuente o de naturaleza dinámica, tales como:

- Noticias publicadas por los usuarios del sistema.  
- Archivos multimedia (imágenes, videos, audios) asociados a las publicaciones.  
- Comentarios, reseñas y reacciones de los lectores.  
- Etiquetas o categorías de clasificación de las noticias.  
- Historial de actualizaciones y metadatos de los contenidos.

De esta manera, MongoDB permitirá manejar información textual, multimedia y de interacción entre usuarios, complementando la base relacional (MySQL), que se encarga de la parte administrativa y estructurada del sistema.  
El resultado es un **sistema híbrido robusto, escalable y flexible**, capaz de combinar información estructurada (MySQL) y documental (MongoDB) dentro de una misma aplicación web.


---

## Conclusión
El motor **MongoDB** fue seleccionado como la base de datos NoSQL para el proyecto **"Liga de Fútbol"** debido a su:
- Compatibilidad con Ubuntu Server 24.04.  
- Integración directa con Python.  
- Modelo documental flexible.  
- Alto rendimiento y escalabilidad.  

Esta elección cumple con los criterios académicos y técnicos exigidos, garantizando una integración eficiente con la base relacional **MySQL** y la aplicación web del proyecto.
