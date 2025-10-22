# PowerShell script to run database migrations in Docker container

Write-Host "Running database migrations..." -ForegroundColor Green

# Check if API container is running
$containerRunning = docker ps --filter "name=bottlebuddy-api" --format "{{.Names}}"

if (-not $containerRunning) {
    Write-Host "Error: API container is not running!" -ForegroundColor Red
    Write-Host "Start the containers first with: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

# Run migrations inside the container
docker exec -it bottlebuddy-api dotnet ef database update

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Migration failed!" -ForegroundColor Red
    exit 1
}
