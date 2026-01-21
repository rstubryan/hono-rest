.PHONY: help docker-up docker-down docker-build docker-logs docker-shell clean install dev test type format

help: ## Show this help message
	@echo Usage: make [target]
	@echo.
	@echo Available targets:
	@echo   docker-up           Start Docker containers
	@echo   docker-down         Stop Docker containers
	@echo   docker-build        Build Docker containers
	@echo   docker-logs         Show Docker container logs
	@echo   docker-shell        Open shell in running container
	@echo   docker-restart      Restart Docker containers
	@echo   install             Install dependencies locally
	@echo   dev                Run development server locally
	@echo   test               Run tests
	@echo   type               Run type check
	@echo   format             Run formatter (prettier)
	@echo   clean              Clean Docker resources
	@echo   help               Show this help message

docker-up: ## Start Docker containers
	docker compose up -d

docker-down: ## Stop Docker containers
	docker compose down

docker-build: ## Build Docker containers
	docker compose build

docker-fresh:  ## Build fresh Docker containers
	docker compose down
	docker compose build --no-cache
	docker compose up -d

docker-logs: ## Show Docker container logs
	docker compose logs -f server

docker-shell: ## Open shell in running container
	docker compose exec server sh

docker-restart: docker-down docker-up ## Restart Docker containers

install: ## Install dependencies locally
	bun install

dev: ## Run development server locally
	bun run dev

test: ## Run tests
	bun run test

type: ## Run type check
	bun run type

format: ## Run formatter (prettier)
	bun run format

clean: ## Clean Docker resources
	docker compose down -v
	docker system prune -f

.DEFAULT_GOAL := help
