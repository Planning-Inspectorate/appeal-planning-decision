APPS = data packages/*
STACKS = common environments
SSH_KEY ?= ~/.ssh/id_rsa.pub
PUB_KEY = $(shell cat $(SSH_KEY))

down:
	docker-compose down
.PHONY: down

install:
	npm ci
.PHONY: install

run:
	docker-compose run \
		--rm \
		--service-ports \
		${SERVICE} \
		${CMD}
.PHONY: run

# all services
serve:
	docker compose --profile all -f docker-compose.yml -f docker-compose.full.yml up
.PHONY: serve

# all services slimmed down by mocking some more services
slim:
	docker compose --profile all -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: slim

# only services required for appeals/forms-web-app
appeals:
	docker compose --profile appeals -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: appeals

# only services required for documents
documents:
	docker compose --profile documents -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: documents

# only pdf service
pdf:
	docker compose --profile pdf -f docker-compose.yml -f docker-compose.full.yml up
.PHONY: pdf

database:
	docker compose --profile database -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: database

storage:
	docker compose --profile storage -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: storage

c4:
	docker compose --profile c4 -f docker-compose.yml -f docker-compose.slim.yml up
.PHONY: c4

uninstall:
	rm -Rf node_modules
	rm -Rf .git/hooks

	for dir in ${APPS}; do \
		(cd $${dir} && rm -Rf node_modules); \
  	done
.PHONY: uninstall
