.PHONY: help install dev check lint typecheck build audit audit-prod \
        start stop restart status logs logs-web web-start web-stop web-status \
        clean clean-deps docker-build docker-up docker-down docker-status docker-logs docker-shell docker-clean docker-check

# --- Configuration -----------------------------------------------------------

WEB_PORT ?= 3000
WEB_HOST ?= 127.0.0.1
WEB_URL  := http://localhost:$(WEB_PORT)

APP_NAME := cvforge
IMAGE    := cvforge:latest
CONTAINER := cvforge-app

.DEFAULT_GOAL := help

# --- Help --------------------------------------------------------------------

help:
	@echo "CVForge Development Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make install       Install dependencies"
	@echo "  make dev           Run Next.js frontend in the foreground"
	@echo "  make check         Run linting, typechecking, and production build"
	@echo "  make audit         Run dependency security audit"
	@echo "  make audit-prod    Run production dependency security audit"
	@echo ""
	@echo "  make start         Start frontend in the background"
	@echo "  make stop          Stop background frontend"
	@echo "  make restart       Restart background frontend"
	@echo "  make status        Show project, web, and Docker status"
	@echo "  make logs          Follow frontend logs"
	@echo ""
	@echo "  make web-start     Start frontend in the background"
	@echo "  make web-stop      Stop background frontend"
	@echo "  make web-status    Check background frontend status"
	@echo "  make logs-web      Follow frontend logs"
	@echo ""
	@echo "  make docker-build  Build production Docker image"
	@echo "  make docker-up     Build and start production Docker container"
	@echo "  make docker-down   Stop production Docker container"
	@echo "  make docker-status Show Docker container status"
	@echo "  make docker-logs   Follow Docker logs"
	@echo "  make docker-check  Start Docker container and check main routes"
	@echo ""
	@echo "  make clean         Remove build artifacts"
	@echo "  make clean-deps    Remove node_modules"

# --- Setup -------------------------------------------------------------------

install:
	pnpm install

# --- Foreground Development --------------------------------------------------

dev:
	pnpm --filter web dev --hostname $(WEB_HOST) --port $(WEB_PORT)

# --- Validation --------------------------------------------------------------

lint:
	pnpm lint

typecheck:
	pnpm typecheck

build:
	pnpm build

check: lint typecheck build

audit:
	pnpm audit

audit-prod:
	pnpm audit-prod

# --- Background Web Process --------------------------------------------------

start: web-start

stop: web-stop

restart: web-stop web-start

web-start:
	@mkdir -p .logs .pids
	@if [ -f .pids/web.pid ] && kill -0 $$(cat .pids/web.pid) 2>/dev/null; then \
		echo "Web is already running (PID $$(cat .pids/web.pid))"; \
		echo "URL: $(WEB_URL)"; \
		exit 0; \
	fi
	@if lsof -i :$(WEB_PORT) >/dev/null 2>&1; then \
		echo "Error: Port $(WEB_PORT) is already in use."; \
		lsof -i :$(WEB_PORT); \
		exit 1; \
	fi
	@echo "Starting CVForge web server in background on $(WEB_URL)..."
	@setsid sh -c 'exec pnpm --filter web dev --hostname $(WEB_HOST) --port $(WEB_PORT) > .logs/web.log 2>&1' & echo $$! > .pids/web.pid
	@sleep 2
	@if kill -0 $$(cat .pids/web.pid) 2>/dev/null; then \
		echo "Web started (PID $$(cat .pids/web.pid))"; \
		echo "URL: $(WEB_URL)"; \
		echo "Logs: .logs/web.log"; \
	else \
		echo "Web failed to start. Check .logs/web.log"; \
		rm -f .pids/web.pid; \
		exit 1; \
	fi

web-stop:
	@if [ -f .pids/web.pid ]; then \
		PID=$$(cat .pids/web.pid); \
		if kill -0 $$PID 2>/dev/null; then \
			echo "Stopping Web process group (PGID $$PID)..."; \
			kill -TERM -$$PID 2>/dev/null || kill -TERM $$PID; \
			sleep 2; \
			if kill -0 $$PID 2>/dev/null; then \
				echo "Process still alive, force killing..."; \
				kill -KILL -$$PID 2>/dev/null || kill -KILL $$PID; \
			fi; \
		fi; \
		rm -f .pids/web.pid; \
		echo "Web stopped."; \
	else \
		echo "Web is not running."; \
	fi

web-status:
	@if [ -f .pids/web.pid ] && kill -0 $$(cat .pids/web.pid) 2>/dev/null; then \
		echo "Web: Running (PID $$(cat .pids/web.pid))"; \
		echo "URL: $(WEB_URL)"; \
		echo "Log: .logs/web.log"; \
	else \
		echo "Web: Stopped"; \
	fi

# --- Status and Logs ---------------------------------------------------------

status:
	@echo "--- Git Status ---"
	@git status --short
	@echo ""
	@echo "--- Runtime ---"
	@node -v | xargs echo "node:"
	@pnpm -v | xargs echo "pnpm:"
	@echo ""
	@echo "--- Web Service ---"
	@$(MAKE) web-status
	@echo ""
	@echo "--- Docker Services ---"
	@docker compose ps 2>/dev/null || true

logs: logs-web

logs-web:
	@if [ -f .logs/web.log ]; then \
		tail -n 100 -f .logs/web.log; \
	else \
		echo "Frontend log not found. Run 'make web-start' first."; \
	fi

# --- Cleanup -----------------------------------------------------------------

clean:
	rm -rf apps/web/.next
	rm -rf apps/web/out

clean-deps:
	rm -rf node_modules
	rm -rf apps/web/node_modules

# --- Docker Production Workflow ----------------------------------------------

docker-build:
	docker build -t $(IMAGE) .

docker-up: docker-build
	docker compose up -d

docker-down:
	docker compose down

docker-status:
	docker compose ps
	@echo ""
	@echo "--- Container Logs Tail ---"
	docker compose logs --tail 30

docker-logs:
	docker compose logs -f

docker-shell:
	docker exec -it $(CONTAINER) /bin/sh

docker-clean:
	docker compose down -v
	docker rmi $(IMAGE) || true

docker-check: docker-up
	@echo "Waiting for container..."
	@sleep 2
	@echo "Checking routes..."
	@node -e "Promise.all(['/','/builder','/parser'].map(async (path) => { const response = await fetch('http://localhost:3000' + path); if (!response.ok) throw new Error(path + ' returned ' + response.status); console.log(response.status, path); })).catch((error) => { console.error(error); process.exit(1); })"
