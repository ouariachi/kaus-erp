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
    find "$backup_dir" -name "$PGDATABASE-backup-*.sql" -type f -mtime +$RETENTION_DAYS | while read file; do
      echo "Eliminando: $file"
      rm -f "$file"
    done

    # Buscar y eliminar archivos de log
    find "$backup_dir" -name "backup-log-*.log" -type f -mtime +$RETENTION_DAYS | while read file; do
      echo "Eliminando: $file"
      rm -f "$file"
    done

  else
    echo "Directorio $backup_dir no encontrado, omitiendo..."
  fi
}

clean_old_backups "$DAILY_BACKUP_DIR"
clean_old_backups "$WEEKLY_BACKUP_DIR"
clean_old_backups "$HOURLY_BACKUP_DIR"

echo "Limpieza de copias de seguridad completada."
