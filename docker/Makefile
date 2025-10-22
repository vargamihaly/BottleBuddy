# Makefile for BottleShare Docker operations

.PHONY: help build up down restart logs clean migrate db-backup db-restore dev prod

# Default target
help:
	@echo "BottleShare Docker Commands:"
	@echo ""
	@echo "  make build         - Build all containers"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make logs          - View logs (follow mode)"
	@echo "  make clean         - Remove all containers and volumes"
	@echo "  make migrate       - Run database migrations"
	@echo "  make db-backup     - Backup database"
	@echo "  make db-restore    - Restore database"
	@echo "  make dev           - Start in development mode"
	@echo "  make prod          - Start in production mode"
	@echo ""
	@echo "Service-specific:"
	@echo "  make logs-api      - View API logs"
	@echo "  make logs-frontend - View frontend logs"
	@echo "  make logs-db       - View database logs"
	@echo "  make shell-api     - Open shell in API container"
	@echo "  make shell-db      - Open PostgreSQL shell"

# Production mode (default)
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

# Development mode
dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Production mode
prod: build up migrate

# Database operations
migrate:
	docker exec -it bottlebuddy-api dotnet ef database update

db-backup:
	docker exec bottlebuddy-db pg_dump -U postgres bottlebuddy > backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Backup created: backup-$$(date +%Y%m%d-%H%M%S).sql"

db-restore:
	@echo "Usage: make db-restore FILE=backup.sql"
	@if [ -z "$(FILE)" ]; then \
		echo "Error: FILE parameter required"; \
		exit 1; \
	fi
	cat $(FILE) | docker exec -i bottlebuddy-db psql -U postgres -d bottlebuddy

# Service-specific logs
logs-api:
	docker-compose logs -f api

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f postgres

# Shell access
shell-api:
	docker exec -it bottlebuddy-api /bin/bash

shell-frontend:
	docker exec -it bottlebuddy-frontend /bin/sh

shell-db:
	docker exec -it bottlebuddy-db psql -U postgres -d bottlebuddy

# Rebuild and restart
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Health check
health:
	@echo "Checking service health..."
	@docker-compose ps
