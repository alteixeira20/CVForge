# CVForge - Developer & Deployment Workflows

.DEFAULT_GOAL := help

.PHONY: help
help: ## Display this help message
	@echo "CVForge Management"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install all dependencies
	pnpm install

.PHONY: dev
dev: ## Start development server
	pnpm dev

.PHONY: build
build: ## Build the production application
	pnpm build

.PHONY: start
start: ## Start the production server locally
	pnpm start

.PHONY: lint
lint: ## Run linting checks
	pnpm lint

.PHONY: typecheck
typecheck: ## Run TypeScript type checks
	pnpm typecheck

.PHONY: verify
verify: lint typecheck build ## Run full validation suite (lint, typecheck, build)

.PHONY: clean
clean: ## Remove build artifacts
	rm -rf apps/web/.next
	rm -rf apps/web/out

.PHONY: clean-deps
clean-deps: ## Remove all node_modules
	rm -rf node_modules
	rm -rf apps/web/node_modules

.PHONY: audit
audit: ## Run security audit
	pnpm audit

.PHONY: audit-prod
audit-prod: ## Run production security audit
	pnpm audit-prod

.PHONY: status
status: ## Show project status
	@echo "--- Project Status ---"
	@git status --short
	@echo "--- Dependencies ---"
	@pnpm -v | xargs echo "pnpm version:"
	@node -v | xargs echo "node version:"

# --- Docker ---

.PHONY: docker-build
docker-build: ## Build production Docker image
	docker build -t cvforge:latest .

.PHONY: docker-up
docker-up: ## Start production container (detached)
	docker compose up -d

.PHONY: docker-down
docker-down: ## Stop production container
	docker compose down

.PHONY: docker-logs
docker-logs: ## View container logs
	docker compose logs -f

.PHONY: docker-shell
docker-shell: ## Access shell in running container
	docker exec -it cvforge-app /bin/sh

.PHONY: docker-clean
docker-clean: ## Remove Docker image and volumes
	docker compose down -v
	docker rmi cvforge:latest || true
