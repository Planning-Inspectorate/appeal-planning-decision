APPS = data e2e-tests lpa-submissions-e2e-tests packages/*
STACKS = common environments
SSH_KEY ?= ~/.ssh/id_rsa.pub
PUB_KEY = $(shell cat $(SSH_KEY))

down:
	docker-compose down
.PHONY: down

install:
	npm -v
	npm ci

	# Because there are expectations that the common package behaves like an NPM package from the perspective of
	# other `package.json` files in the `packages` directory. Build this first to ensure the installation process works.
	echo "-- Installing the common directory dependency --"
	(cd packages/common && npm install)
	echo "-- Installed the common directory dependency --"

	for dir in ${APPS}; do \
		echo "-- Installing $${dir} --"; \
		(cd $${dir} && npm ci); \
		echo "-- Installed for $${dir} --"; \
  	done

	# `packages/common/package.json` has a `postinstall` script to ensure the webpack assets are bundled for production.
	# We do not want the production build of webpack for local development. This is because local dev does not behave
	# identically to dev / preprod / prod, e.g. no SSL on local. This ensures the correct assets are used in dev.
	echo "-- Building the common directory development environment assets --"
	(cd packages/common && npm run build:dev)
	echo "-- Built the common directory development environment assets --"

	echo "-- Creating large test files for e2e tests --"
	(cd e2e-tests && ./create-large-test-files.sh)
	echo "-- Complete --"
.PHONY: install

openfaas:
	curl -sSL https://raw.githubusercontent.com/openfaas/faasd/master/cloud-config.txt > .faasd.txt

	sed -i -e "s~ssh-rsa.*~${PUB_KEY}~g" .faasd.txt

	multipass launch \
		--cloud-init .faasd.txt \
		--name faasd

	rm .faasd.txt
.PHONY: openfaas

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

tf-doc:
	# Requires Terraform Docs
	# @link https://github.com/terraform-docs/terraform-docs
	for dir in ${STACKS}; do \
  		terraform-docs \
  			-c ../.terraform-docs.yml \
  			./infrastructure/$${dir} \
  			> ./infrastructure/$${dir}/README.md; \
  	done
.PHONY: tf-doc

uninstall:
	rm -Rf node_modules
	rm -Rf .git/hooks

	for dir in ${APPS}; do \
		(cd $${dir} && rm -Rf node_modules); \
  	done
.PHONY: uninstall

update-functions:
	faas-cli remove -f functions.yml
	faas-cli up -f functions.yml --tag sha \
		--env APPEALS_SERVICE_URL=http://app.${DEPLOY_NAMESPACE}.svc.cluster.local:3000 \
		--env DOCUMENT_SERVICE_URL=http://app.${DEPLOY_NAMESPACE}.svc.cluster.local:3001
.PHONY: update-functions
