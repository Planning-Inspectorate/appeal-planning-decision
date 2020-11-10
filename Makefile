APPS = common data appeals-service-api forms-web-app
STACKS = common environments

down:
	docker-compose down
.PHONY: down

install:
	npm ci

	for dir in ${APPS}; do \
		(cd $${dir} && npm ci); \
  	done
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
