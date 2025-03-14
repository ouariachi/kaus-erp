#!/bin/bash
source /etc/default/kaus-erp-backup-env

BACKUPTYPE=$1

# Comprobar parametros uno a uno
if [ -z "$PGHOST" ]; then
  echo "Falta la variable de entorno PGHOST"
  exit 1
fi

if [ -z "$PGUSER" ]; then
  echo "Falta la variable de entorno PGUSER"
  exit 1
fi

if [ -z "$PGDATABASE" ]; then
  echo "Falta la variable de entorno PGDATABASE"
  exit 1
fi

if [ -z "$PGPASSWORD" ]; then
  echo "Falta la variable de entorno PGPASSWORD"
  exit 1
fi

if [ -z "$BACKUPTYPE" ]; then
  echo "Falta el parámetro BACKUPTYPE"
  exit 1
fi

PGPORT=${PGPORT:-5432}

BACKUP_DIR="/var/backups/erp/$BACKUPTYPE" # daily, weekly, hourly
DATE=$(date +"%Y%m%d%H%M")
BACKUP_FILE="$BACKUP_DIR/$PGDATABASE-backup-$DATE.sql"
LOG_FILE="$BACKUP_DIR/$PGDATABASE-backup-log-$DATE.log"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "Directorio de backup no encontrado: $BACKUP_DIR"
  echo "Creando directorio..."
  mkdir -p "$BACKUP_DIR"
fi

echo "Verificando existencia de la base de datos $PGDATABASE..." | tee -a "$LOG_FILE" > /dev/null
PGPASSWORD="$PGPASSWORD" pg_isready -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" -d "$PGDATABASE" >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "La base de datos $PGDATABASE no está disponible en $PGHOST. Abortando." | tee -a "$LOG_FILE" > /dev/null
  exit 1
fi

echo "Realizando copia de seguridad de la base de datos $PGDATABASE..." | tee -a "$LOG_FILE" > /dev/null
PGPASSWORD="$PGPASSWORD" pg_dump -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" "$PGDATABASE" >> "$BACKUP_FILE" 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
  echo "Copia de seguridad completada: $BACKUP_FILE" | tee -a "$LOG_FILE" > /dev/null
else
  echo "Error al realizar la copia de seguridad" | tee -a "$LOG_FILE" > /dev/null
  exit 1
fi
