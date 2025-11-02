# Implementación de la Máquina Virtual para el Motor de Base de Datos MongoDB  
Proyecto: Liga de Fútbol  

## Introducción
Este documento describe la configuración y el uso de la máquina virtual donde se implementará el motor de base de datos NoSQL **MongoDB**.  
Dado que el proyecto "Liga de Fútbol" utiliza tanto una base de datos relacional (MySQL) como una NoSQL (MongoDB), se optó por **utilizar la misma máquina virtual** configurada previamente para MySQL, garantizando un entorno unificado, estable y eficiente.

---

## Entorno virtual utilizado

- **Nombre de la VM:** ubuntu-db  
- **Hipervisor:** Oracle VM VirtualBox 7.x  
- **Sistema operativo:** Ubuntu Server 24.04 LTS (Long Term Support)  
- **Imagen ISO utilizada:** `ubuntu-24.04.1-live-server-amd64.iso`  
- **Recursos asignados:**
  - Memoria RAM: 4 GB  
  - Procesadores: 2 núcleos  
  - Disco duro virtual: 100 GB (almacenamiento dinámico)  
  - Red: NAT + Adaptador puente  
  - Acceso remoto: SSH habilitado  

---

## Justificación del uso de la misma máquina virtual

1. **Optimización de recursos:**  
   Utilizar una sola VM evita duplicar consumo de CPU, memoria y almacenamiento.

2. **Compatibilidad y coherencia:**  
   Al estar ambos motores de base de datos en el mismo entorno, se facilita la administración y la conexión del backend.

3. **Simplicidad de mantenimiento:**  
   Las actualizaciones del sistema operativo y las configuraciones de red se aplican a un único entorno.

4. **Seguridad centralizada:**  
   Los mismos parámetros del firewall (`ufw`) controlan los puertos de MySQL (3306) y MongoDB (27017).

---

## Verificación previa antes de la instalación

1. **Actualizar los paquetes del sistema:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
2. **Comprobar conectividad a Internet**

```bash
ping google.com
```

---

3. **Verificar conexión SSH desde el host**

```bash
ssh despliegue@<ip-de-la-vm>
```

---

4. **Verificar espacio disponible**

```bash
df -h
```

---

5. **Verificar uso de memoria y CPU**

```bash
free -h
lscpu
```

---

## Preparación del entorno para MongoDB

### Crear carpeta de trabajo para MongoDB

```bash
mkdir -p ~/databases/mongodb
cd ~/databases/mongodb
```

### Configurar puertos de acceso en el firewall

```bash
sudo ufw allow 27017/tcp
sudo ufw status
```

### Confirmar que MySQL está funcionando

```bash
sudo systemctl status mysql
```

> 💡 Esto asegura que ambos motores (MySQL y MongoDB) puedan coexistir sin conflicto de puertos.

---

## Acceso remoto a la máquina virtual

Desde el host se puede acceder mediante:

```bash
ssh despliegue@<ip-de-la-vm>
```

Se recomienda crear un alias en el archivo `.bashrc` para facilitar el acceso:

```bash
alias vmdb='ssh despliegue@<ip-de-la-vm>'
```

---

## Recomendaciones de seguridad

- Cambiar la contraseña del usuario `despliegue` periódicamente.  
- Mantener el firewall `ufw` activo.  
- Evitar ejecutar MongoDB o MySQL como usuario `root`.  
- Realizar respaldos antes de cada cambio importante mediante **VirtualBox Snapshots**.

---

## Verificación final del entorno

- **Sistema operativo:** Ubuntu Server 24.04 LTS  
- **Servicios activos:** SSH y MySQL  
- **Conectividad:** Verificada (Internet y red local)  
- **Puertos configurados:**  
  - 22 (SSH)  
  - 3306 (MySQL)  
  - 27017 (MongoDB)  
- **Listo para:** instalación del motor MongoDB y conexión con el backend.

---

## Conclusión

La máquina virtual **ubuntu-db** se encuentra totalmente operativa para la instalación del motor **MongoDB**.  
El entorno ofrece **compatibilidad**, **estabilidad** y **eficiencia** al alojar tanto la base de datos **relacional** como la **NoSQL** dentro de la misma VM.  

Esta configuración cumple con los lineamientos de la **Fase 2** del proyecto **"Liga de Fútbol"**, optimizando los recursos y simplificando la administración del sistema.
