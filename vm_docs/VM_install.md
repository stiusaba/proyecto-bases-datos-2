# Implementación de la Máquina Virtual – Proyecto "Liga de Fútbol"

## Introducción
Este documento describe el proceso de instalación y configuración de la máquina virtual que sirve como entorno de desarrollo y pruebas para los motores de bases de datos del proyecto "Liga de Fútbol".  
El objetivo es disponer de un entorno controlado, seguro y estable en Linux, cumpliendo los lineamientos del proyecto.

## Software utilizado
- **Hipervisor:** Oracle VM VirtualBox 7.x  
- **Sistema operativo invitado:** Ubuntu Server 24.04.1 LTS (64 bits)  
- **Imagen ISO:** ubuntu-24.04.1-live-server-amd64.iso  
- **Host:** Windows 11 Pro  

## Especificaciones técnicas
- Memoria RAM: 4 GB  
- Procesadores: 2 núcleos  
- Disco duro virtual: 100 GB (almacenamiento dinámico)  
- Red: NAT + Adaptador puente  
- Nombre de la VM: ubuntu-db  
- Video: modo consola  

## Instalación del sistema operativo
1. Crear una nueva máquina virtual en VirtualBox y asignar los recursos.  
2. Montar la imagen ISO de Ubuntu Server.  
3. Durante la instalación:
   - Idioma: Español  
   - Usuario: `despliegue`  
   - Hostname: `ubuntu-db`  
   - Partición del disco: “Usar todo el disco”  
   - Instalar **OpenSSH Server**  
4. Reiniciar al finalizar.

## Configuración inicial
Actualizar el sistema:
```bash
sudo apt update && sudo apt upgrade -y
```
# Verificación y Configuración del Entorno Ubuntu

## Verificar la versión del sistema operativo

Ejecutar el siguiente comando para conocer la versión actual del sistema operativo instalado:

```bash
lsb_release -a
```

---

## Verificar conexión de red

Para confirmar la conectividad a Internet desde la máquina virtual, ejecutar el siguiente comando:

```bash
ping google.com
```

Si se reciben respuestas, la red está correctamente configurada.

---

## Instalar herramientas básicas

Instalar los paquetes y utilidades más comunes para la administración del sistema:

```bash
sudo apt install -y net-tools curl wget nano htop unzip
```

Estas herramientas permiten monitorear recursos, descargar archivos, editar configuraciones y realizar tareas administrativas básicas.

---

## Configurar zona horaria

Definir la zona horaria correspondiente a **Colombia** mediante el comando:

```bash
sudo timedatectl set-timezone America/Bogota
```

Verificar la configuración con:

```bash
timedatectl
```

Esto asegura que el sistema registre correctamente la hora local, lo cual es importante para la sincronización de procesos y registros de base de datos.

---

## Conectividad

- **Red NAT:** acceso a Internet.  
- **Adaptador puente:** permite comunicación directa entre el host y la máquina virtual.  
- **Acceso remoto SSH:** habilitado para administrar la máquina desde el host mediante el siguiente comando:

  ```bash
  ssh despliegue@<ip-de-la-vm>
  ```

Esta configuración garantiza conectividad tanto externa (Internet) como interna (red local entre host y VM).

---

## Configuración de seguridad

- El acceso **root** está deshabilitado; el sistema se administra mediante el uso de `sudo`.  
- El firewall **ufw** se encuentra activo y configurado para permitir únicamente los puertos esenciales:
  - **22 (SSH)** — acceso remoto seguro.  
  - **3306 (MySQL)** — conexión al motor de base de datos relacional.  
  - **27017 (MongoDB)** — conexión al motor de base de datos NoSQL.  

> 🔒 **Recomendación:** crear instantáneas de respaldo antes de realizar instalaciones o cambios críticos en la configuración del sistema.  
> Esto permite restaurar el entorno en caso de fallos o errores durante la instalación de componentes.

---

## Verificación del entorno

Una vez completadas las configuraciones anteriores, se recomienda realizar una verificación general del entorno:

- **Sistema operativo:** Ubuntu Server 24.04.1 LTS  
- **Acceso SSH:** activo y funcional  
- **Conectividad a Internet:** verificada mediante `ping google.com`  
- **Recursos del sistema:** comprobados con los comandos `free -h` (memoria) y `lscpu` (procesador)  
- **Almacenamiento disponible:** comprobado con `df -h`  

Estas verificaciones garantizan que la máquina cuenta con los recursos y configuraciones necesarias para ejecutar los motores de base de datos sin inconvenientes.

---

## Conclusión

La máquina virtual **ubuntu-db** se encuentra completamente **instalada, configurada y verificada**.  
Proporciona un entorno **controlado, seguro y optimizado** para la instalación de los motores **MySQL** y **MongoDB**, los cuales serán utilizados en el desarrollo del proyecto **"Liga de Fútbol"**.  

Este entorno cumple con los **requisitos de la Fase 2** del proyecto y servirá como base para la implementación de los sistemas de bases de datos **relacional (SQL)** y **NoSQL (MongoDB)**, garantizando compatibilidad, seguridad y eficiencia en el despliegue.
