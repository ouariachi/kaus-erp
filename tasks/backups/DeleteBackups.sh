#!/bin/bash
source /etc/default/kaus-erp-backup-env

DAILY_BACKUP_DIR="/var/backups/erp/daily"
WEEKLY_BACKUP_DIR="/var/backups/erp/weekly"
HOURLY_BACKUP_DIR="/var/backups/erp/hourly"

LOGS_BASE_DIR="/var/backups/erp/logs"
if [ ! -d "$LOGS_BASE_DIR" ]; then
  echo "Directorio de logs no encontrado: $LOGS_BASE_DIR"
  echo "Creando directorio..."
  mkdir -p "$LOGS_BASE_DIR"
fi

LOGS_DIR="$LOGS_BASE_DIR/deletions"
if [ ! -d "$LOGS_DIR" ]; then
  echo "Directorio de logs de eliminaciones no encontrado: $LOGS_DIR"
  echo "Creando directorio..."
  mkdir -p "$LOGS_DIR"
fi

LOG_FILE="$LOGS_DIR/deletions-$DATE.log"

RETENTION_DAYS=30
TODAY=$(date +"%Y%m%d")

if [ -z "$PGDATABASE" ]; then
  echo "Falta la variable de entorno PGDATABASE" | tee -a "$LOG_FILE" > /dev/null
  exit 1
fi

echo "Eliminando copias de seguridad de más de $RETENTION_DAYS días..." | tee -a "$LOG_FILE" > /dev/null

clean_old_backups() {
  local backup_dir=$1
  if [ -d "$backup_dir" ]; then
    echo "Limpiando $backup_dir..." | tee -a "$LOG_FILE" >> /dev/null

    # Contadores de archivos eliminados
    DELETED_BACKUPS_COUNT=0
    DELETED_LOGS_COUNT=0

    # Buscar archivos .sql
    echo "Buscando archivos: $PGDATABASE-backup-*.sql..." | tee -a "$LOG_FILE" >> /dev/null
    for file in "$backup_dir"/"$PGDATABASE"-backup-*.sql; do
      filename=$(basename "$file")
      filedate=$(echo "$filename" | grep -oP '\d{12}' | head -1) # Extraer YYYYMMDDHHMM
      filedate_short=${filedate:0:8} # Obtener YYYYMMDD

      if [[ "$filedate_short" =~ ^[0-9]{8}$ ]]; then
        diff_days=$(( ( $(date -d "$TODAY" +%s) - $(date -d "$filedate_short" +%s) ) / 86400 ))
        if [ "$diff_days" -gt "$RETENTION_DAYS" ]; then
          echo "Eliminando: $file ($diff_days días de antigüedad)" | tee -a "$LOG_FILE" >> /dev/null
          rm -f "$file"
          ((DELETED_BACKUPS_COUNT++))
        fi
      fi
    done

    # Buscar archivos de log
    echo "Buscando archivos: backup-log-*.log..." | tee -a "$LOG_FILE" >> /dev/null
    for file in "$backup_dir"/backup-log-*.log; do
      filename=$(basename "$file")
      filedate=$(echo "$filename" | grep -oP '\d{12}' | head -1)
      filedate_short=${filedate:0:8}

      if [[ "$filedate_short" =~ ^[0-9]{8}$ ]]; then
        diff_days=$(( ( $(date -d "$TODAY" +%s) - $(date -d "$filedate_short" +%s) ) / 86400 ))
        if [ "$diff_days" -gt "$RETENTION_DAYS" ]; then
          echo "Eliminando: $file ($diff_days días de antigüedad)" | tee -a "$LOG_FILE" >> /dev/null
          rm -f "$file"
          ((DELETED_LOGS_COUNT++))
        fi
      fi
    done

    if [ "$DELETED_BACKUPS_COUNT" -gt 0 ]; then
      echo "Se eliminaron $DELETED_BACKUPS_COUNT archivos de copias de seguridad." | tee -a "$LOG_FILE" >> /dev/null
    fi
    
    if [ "$DELETED_LOGS_COUNT" -gt 0 ]; then
      echo "Se eliminaron $DELETED_LOGS_COUNT archivos de registros de copias de seguridad." | tee -a "$LOG_FILE" >> /dev/null
    fi
  else
    echo "Directorio $backup_dir no encontrado, omitiendo..." | tee -a "$LOG_FILE" >> /dev/null
  fi
}

clean_old_backups "$DAILY_BACKUP_DIR"
clean_old_backups "$WEEKLY_BACKUP_DIR"
clean_old_backups "$HOURLY_BACKUP_DIR"

echo "Limpieza de copias de seguridad completada." | tee -a "$LOG_FILE" >> /dev/null
