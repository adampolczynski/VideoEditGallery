.PHONY: help install dev build start docker-build docker-up docker-down clean

help:
	@echo "Video Portfolio - Available Commands"
	@echo "===================================="
	@echo "install       - Install dependencies"
	@echo "dev           - Start development server"
	@echo "build         - Build for production"
	@echo "start         - Start production server"
	@echo "docker-build  - Build Docker image"
	@echo "docker-up     - Start Docker container"
	@echo "docker-down   - Stop Docker container"
	@echo "clean         - Remove node_modules and dist"
	@echo "seed          - Seed database with sample data"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

docker-build:
	docker build -t video-portfolio:latest .

docker-up:
	@if docker compose version >/dev/null 2>&1; then \
		docker compose up -d; \
	elif command -v docker-compose >/dev/null 2>&1; then \
		docker-compose up -d; \
	else \
		echo "Docker Compose is not installed. Install the Docker Compose plugin or run: docker build -t video-portfolio:latest ."; \
		exit 1; \
	fi

docker-down:
	@if docker compose version >/dev/null 2>&1; then \
		docker compose down; \
	elif command -v docker-compose >/dev/null 2>&1; then \
		docker-compose down; \
	else \
		echo "Docker Compose is not installed."; \
		exit 1; \
	fi

docker-logs:
	@if docker compose version >/dev/null 2>&1; then \
		docker compose logs -f video-portfolio; \
	elif command -v docker-compose >/dev/null 2>&1; then \
		docker-compose logs -f video-portfolio; \
	else \
		echo "Docker Compose is not installed."; \
		exit 1; \
	fi

clean:
	rm -rf node_modules dist package-lock.json

seed:
	node scripts/seed-db.js
