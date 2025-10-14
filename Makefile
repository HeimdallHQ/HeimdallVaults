# ─── Project Makefile ──────────────────────────────────────────────
# Entrypoint for local dev environment
# Only calls Tilt; never calls docker-compose directly.

TILT ?= tilt
TILTFILE := dev/Tiltfile

.PHONY: up down logs restart clean trigger-api trigger-web

## Start the full dev environment
up:
	@echo "🚀 Starting Tilt (Compose + live reload)"
	$(TILT) up -f $(TILTFILE)

## Stop all Tilt resources
down:
	@echo "🛑 Stopping Tilt"
	$(TILT) down -f $(TILTFILE)

## Stream logs from all resources
logs:
	@$(TILT) logs -f $(TILTFILE)

## Restart all Tilt resources
restart: down up

## Trigger a rebuild of only the API service
trigger-api:
	@$(TILT) trigger api -f $(TILTFILE)

## Trigger a rebuild of only the Web service
trigger-web:
	@$(TILT) trigger web -f $(TILTFILE)

## Clean up Docker artifacts (optional convenience)
clean:
	@echo "🧹 Cleaning up Docker images/volumes"
	docker compose down --volumes --remove-orphans || true
	docker system prune -f
