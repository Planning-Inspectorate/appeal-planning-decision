APPS = data appeals-service-api forms-web-app

down:
	docker-compose down
.PHONY: down

install:
	npm ci

	for dir in ${APPS}; do \
		(cd $${dir} && npm ci); \
  	done
.PHONY: install

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
