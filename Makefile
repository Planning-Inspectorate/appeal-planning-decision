
# all services
serve:
	npm run db:generate && \
	docker compose --profile all -f docker-compose.yml -f docker-compose.full.yml up
.PHONY: serve

# all services slimmed down by mocking some more services
slim:
	npm run db:generate && \
	docker compose --profile all -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: slim

database:
	docker compose --profile database -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: database


c4:
	docker compose --profile c4 -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: c4
