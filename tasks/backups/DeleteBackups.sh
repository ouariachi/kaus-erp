#!/bin/bash
source /etc/default/kaus-erp-backup-env

DAILY_BACKUP_DIR="/var/backups/erp/daily"
WEEKLY_BACKUP_DIR="/var/backups/erp/weekly"
HOURLY_BACKUP_DIR="/var/backups/erp/hourly"

if [ -z "$PGDATABASE" ]; then
  echo "Falta la variable de entorno PGDATABASE"
  exit 1
fi

# Número de días después de los que se elimina el backup
RETENTION_DAYS=30
echo "Eliminando copias de seguridad de más de $RETENTION_DAYS días..."

clean_old_backups() {
  local backup_dir=$1
  if [ -d "$backup_dir" ]; then
    echo "Limpiando $backup_dir..."

    # Buscar y eliminar archivos .sql
    DELETED_BACKUPS_COUNT=0
    echo "Buscando archivos: $PGDATABASE-backup-*.sql..." 
    find "$backup_dir" -name "$PGDATABASE-backup-*.sql" -type f -mtime +$RETENTION_DAYS | while read file; do
      echo "Eliminando: $file"
      rm -f "$file"
      DELETED_BACKUPS_COUNT=$((DELETED_BACKUPS_COUNT+1))
    done

    # Buscar y eliminar archivos de log
    DELETED_LOGS_COUNT=0
    echo "Buscando archivos: $PGDATABASE-backup-log-*.log..."
    find "$backup_dir" -name "$PGDATABASE-backup-log-*.log" -type f -mtime +$RETENTION_DAYS | while read file; do
      echo "Eliminando: $file"
      rm -f "$file"
      DELETED_LOGS_COUNT=$((DELETED_LOGS_COUNT+1))
    done

    if [ $DELETED_BACKUPS_COUNT -gt 0 ]; then
      echo "Se eliminaron $DELETED_BACKUPS_COUNT archivos de copias de seguridad."
    fi
    
    if [ $DELETED_LOGS_COUNT -gt 0 ]; then
      echo "Se eliminaron $DELETED_LOGS_COUNT archivos de registros de copias de seguridad."
    fi
  else
    echo "Directorio $backup_dir no encontrado, omitiendo..."
  fi
}

clean_old_backups "$DAILY_BACKUP_DIR"
clean_old_backups "$WEEKLY_BACKUP_DIR"
clean_old_backups "$HOURLY_BACKUP_DIR"

echo "Limpieza de copias de seguridad completada."
