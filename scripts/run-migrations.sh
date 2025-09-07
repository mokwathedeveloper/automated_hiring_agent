#!/usr/bin/env bash

# This script should be run with the project root as the current working directory

# Exit as soon as we run into a non-zero exit return code
set -e

# Check if .env file exists
if [ -f ".env" ]; then
    echo "Sourcing environment variables from .env"
    set -a  # Automatically export all variables
    source .env
    set +a  # Turn off automatic export of all variables
else
    echo "No .env file found. Assuming already set in environment"
fi

DEST_DIR="scripts/_"
BINARY_PATH="$DEST_DIR/migrate"
URL="https://github.com/golang-migrate/migrate/releases/download/v4.18.3/migrate.linux-amd64.tar.gz"

# Check for --force flag
FORCE=false
if [[ "$1" == "--force" ]]; then
  FORCE=true
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Download only if file doesn't exist or --force is used
if [[ ! -f "$BINARY_PATH" || "$FORCE" == true ]]; then
  echo "Downloading migrate binary..."
  curl -sL "$URL" | tar -xz -C "$DEST_DIR"
else
  echo "Re-using existing migrate binary at $BINARY_PATH. Use --force to re-download."
fi

# Exit iff the environment variable, `POSTGRESQL_URL`, is not set or is empty
: "${POSTGRESQL_URL:?You must set the environment variable POSTGRESQL_URL or add it to the .env file}"

# Run all migrations
scripts/_/migrate -source file://migrations/supabase -database "$POSTGRESQL_URL" up
