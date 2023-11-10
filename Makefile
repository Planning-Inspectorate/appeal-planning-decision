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
