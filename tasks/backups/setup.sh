#!/bin/bash

NAMES=("KausERPBackupWeekly" "KausERPBackupDaily" "KausERPBackupHourly" "KausERPDeleteOldBackups")
CREATE_BUCKUP_SCRIPT="CreateBackup.sh"
DELETE_BUCKUP_SCRIPT="DeleteBackups.sh"

TIMER_PATH="/etc/systemd/system"
SCRIPT_PATH="/usr/local/bin"
ENV_PATH="/etc/default"
LOCALPATH="$(pwd)/backups"
LOCAL_ENV_PATH="$LOCALPATH/kaus-erp-backup-env"

# Solicitar datos antes de continuar
read -p "Introduce el host de la base de datos: " DB_HOST
read -p "Introduce el nombre de usuario de la base de datos: " DB_USER
read -p "Introduce el nombre de la base de datos: " DB_NAME
read -p "Introduce el puerto de la base de datos: " DB_PORT
read -p "Introduce la contraseña de la base de datos: " DB_PASSWORD

# Crear archivos de configuración
echo "PGHOST=\"$DB_HOST\"" >> "$LOCAL_ENV_PATH"
echo "PGUSER=\"$DB_USER\"" >> "$LOCAL_ENV_PATH"
echo "PGDATABASE=\"$DB_NAME\"" >> "$LOCAL_ENV_PATH"
echo "PGPORT=\"$DB_PORT\"" >> "$LOCAL_ENV_PATH"
echo "PGPASSWORD=\"$DB_PASSWORD\"" >> "$LOCAL_ENV_PATH"

# Eliminar archivos de configuración anteriores
sudo rm -f "$SCRIPT_PATH/$CREATE_BUCKUP_SCRIPT" "$SCRIPT_PATH/$DELETE_BUCKUP_SCRIPT" "$ENV_PATH/kaus-erp-backup-env"

sudo cp "$LOCALPATH/$CREATE_BUCKUP_SCRIPT" "$SCRIPT_PATH/$CREATE_BUCKUP_SCRIPT"
sudo cp "$LOCALPATH/$DELETE_BUCKUP_SCRIPT" "$SCRIPT_PATH/$DELETE_BUCKUP_SCRIPT"
sudo cp "$LOCAL_ENV_PATH" "$ENV_PATH/kaus-erp-backup-env"

for NAME in "${NAMES[@]}"; do
  if systemctl list-timers --all | grep -q "$NAME"; then
    echo "Eliminando tarea $NAME"
    sudo systemctl stop "$NAME.timer"
    sudo systemctl disable "$NAME.timer"
    sudo rm -f "$TIMER_PATH/$NAME.timer" "$TIMER_PATH/$NAME.service" "$SCRIPT_PATH/$NAME.sh"
  fi

  echo "Creando tarea $NAME"
  sudo cp "$LOCALPATH/$NAME.timer" "$TIMER_PATH/$NAME.timer"
  sudo cp "$LOCALPATH/$NAME.service" "$TIMER_PATH/$NAME.service"
  sudo cp "$LOCALPATH/$NAME.sh" "$SCRIPT_PATH/$NAME.sh"
  sudo chmod +x "$SCRIPT_PATH/$NAME.sh"
  sudo systemctl enable "$NAME.timer"
  sudo systemctl start "$NAME.timer"
  echo "Tarea $NAME creada"
done