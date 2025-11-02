# Modelo Documental de MongoDB – Sistema de Noticias  
Proyecto: Liga de Fútbol (Componente NoSQL)

## Introducción
El componente NoSQL del proyecto "Liga de Fútbol" se implementa utilizando **MongoDB**, pero se enfoca en el manejo de información **no estructurada o semiestructurada**, relacionada con la gestión de **noticias, reseñas, multimedia y etiquetas**.  

Este módulo complementa el sistema relacional (MySQL), encargado de la gestión deportiva, y proporciona una base documental flexible para almacenar contenido dinámico y multimedia asociado a la plataforma web.

---

## Estructura general del modelo
El modelo documental se compone de las siguientes colecciones principales:

1. **usuarios**  
2. **noticias**  
3. **noticia_multimedia**  
4. **noticia_tags**

Estas colecciones se basan en el diagrama conceptual adjunto y representan las relaciones lógicas del sistema de noticias.

---

## Colección: usuarios
Almacena la información de los usuarios que administran o interactúan con el sistema de noticias.  
Cada documento puede representar tanto un redactor como un lector autenticado.

**Ejemplo de documento:**
```json
{
  "_id": ObjectId("673eabc0123456789abc0001"),
  "nombre_usuario": "s_tiusaba",
  "email": "stiusaba@example.com",
  "contraseña": "hash_password",
  "rol": "editor",
  "fecha_registro": "2025-09-01T10:30:00Z",
  "foto_perfil": "https://cdn.ligafutbol.com/perfiles/usuario1.jpg",
  "estado": "activo",
  "ultimo_acceso": "2025-10-10T14:22:00Z"
}
```
## Colección: noticias
Contiene las publicaciones generadas por los usuarios.
Cada documento incluye título, contenido, autor y metadatos de publicación.
Puede relacionarse con etiquetas (tags) o archivos multimedia.

Ejemplo de documento:

```json
Copiar código
{
  "_id": ObjectId("673eabc0123456789abc0002"),
  "id_usuario": ObjectId("673eabc0123456789abc0001"),
  "titulo": "Santa Fe vence 2-1 a Junior en el partido inaugural",
  "contenido": "Con goles de Gómez y Rodríguez, Santa Fe logró una victoria importante en la primera jornada.",
  "fecha_publicacion": "2025-10-20T18:00:00Z",
  "categoria": "Deportes",
  "visitas": 2580,
  "comentarios": [
    {
      "usuario": "juan_perez",
      "comentario": "Excelente partido, buena cobertura.",
      "fecha": "2025-10-21T09:15:00Z"
    },
    {
      "usuario": "laura_m",
      "comentario": "Faltaron estadísticas en la nota.",
      "fecha": "2025-10-21T09:45:00Z"
    }
  ]
}
```
## Colección: noticia_multimedia
Guarda los archivos multimedia (imágenes, videos, audios o documentos) asociados a las noticias.
La relación se mantiene mediante el campo id_noticia.

Ejemplo de documento:

```json
Copiar código
{
  "_id": ObjectId("673eabc0123456789abc0003"),
  "id_noticia": ObjectId("673eabc0123456789abc0002"),
  "tipo": "imagen",
  "url": "https://cdn.ligafutbol.com/noticias/partido1.jpg",
  "descripcion": "Celebración del gol de Gómez al minuto 75."
}
```
## Colección: noticia_tags
Contiene las etiquetas (tags) asociadas a las noticias para mejorar la clasificación y búsqueda de contenido.
Cada documento almacena la referencia de la noticia y la palabra clave o tema.

Ejemplo de documento:

```json
Copiar código
{
  "_id": ObjectId("673eabc0123456789abc0004"),
  "id_noticia": ObjectId("673eabc0123456789abc0002"),
  "tag": "Santa Fe"
}
```
## **Relaciones lógicas entre colecciones**    
- usuarios → noticias:
  Relación uno a muchos (un usuario puede publicar varias noticias).  

- noticias → noticia_multimedia:
  Relación uno a muchos (una noticia puede tener varios archivos multimedia asociados).  

- noticias → noticia_tags:
  Relación uno a muchos (una noticia puede tener múltiples etiquetas).  

- noticias (comentarios):
  Subdocumentos anidados que representan comentarios en cada noticia.  

## **Consideraciones del modelo documental**  
- Las colecciones son independientes, sin claves foráneas obligatorias.  

- La integridad se gestiona a nivel de aplicación (backend).  

- Los identificadores (_id) se utilizan como referencias lógicas entre documentos.  

- Los comentarios y multimedia se manejan mediante subdocumentos o referencias directas.  

- Este modelo es escalable y permite integrar búsquedas rápidas con índices sobre titulo, categoria y fecha_publicacion.  

## **Ventajas del modelo NoSQL**    
- Estructura flexible: Permite modificar la estructura sin alterar el esquema completo.  

- Desempeño en lectura y escritura: Ideal para consultas frecuentes de noticias y comentarios.  

- Soporte multimedia: Maneja fácilmente URLs e información no estructurada.  

- Escalabilidad: Permite el crecimiento horizontal del sistema.  

- Integración sencilla: Compatible con el backend en Python mediante pymongo.  

## **Conclusión**  
El modelo documental diseñado para MongoDB permite gestionar información no estructurada relacionada con noticias, usuarios, etiquetas y archivos multimedia, complementando el modelo relacional implementado en MySQL.  
Gracias a su flexibilidad y escalabilidad, este modelo mejora la experiencia del usuario y permite manejar contenido dinámico en la aplicación web del proyecto "Liga de Fútbol".
