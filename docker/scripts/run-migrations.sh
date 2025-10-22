#!/bin/bash

# Script to run database migrations in Docker container

set -e

echo "Running database migrations..."

# Check if API container is running
if ! docker ps | grep -q bottlebuddy-api; then
    echo "Error: API container is not running!"
    echo "Start the containers first with: docker-compose up -d"
    exit 1
fi

# Run migrations inside the container
docker exec -it bottlebuddy-api dotnet ef database update

echo "Migrations completed successfully!"
