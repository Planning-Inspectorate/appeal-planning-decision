APPS = data packages/*
STACKS = common environments
SSH_KEY ?= ~/.ssh/id_rsa.pub
PUB_KEY = $(shell cat $(SSH_KEY))

down:
	docker-compose down
.PHONY: down

install:
	npm ci

	for dir in ${APPS}; do \
		echo "-- Installing $${dir} --"; \
		(cd $${dir} && npm ci); \
		echo "-- Installed for $${dir} --"; \
  	done

	echo "-- Creating large test files for e2e tests --"
	(cd packages/e2e-tests && ./create-large-test-files.sh)
	echo "-- Complete --"
.PHONY: install

run:
	docker-compose run \
		--rm \
		--service-ports \
		${SERVICE} \
		${CMD}
.PHONY: run

serve:
	docker-compose up
.PHONY: serve

uninstall:
	rm -Rf node_modules
	rm -Rf .git/hooks

	for dir in ${APPS}; do \
		(cd $${dir} && rm -Rf node_modules); \
  	done
.PHONY: uninstall
