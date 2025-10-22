#!/bin/bash

# Startup script for API container - runs migrations and starts the app

set -e

echo "Starting BottleBuddy API..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until dotnet ef database update --no-build 2>/dev/null || [ $? -eq 0 ]; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "PostgreSQL is up - running migrations"

# Run database migrations
dotnet ef database update --no-build

echo "Migrations completed - starting application"

# Start the application
exec dotnet BottleBuddy.Api.dll
