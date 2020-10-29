SERVICES = data appeals-service-api forms-web-app

down:
	docker-compose down
.PHONY: down

install:
	npm ci

	for dir in ${SERVICES}; do \
		(cd $${dir} && npm ci); \
  	done
.PHONY: install

serve:
	docker-compose up
.PHONY: serve

uninstall:
	rm -Rf node_modules

	for dir in ${SERVICES}; do \
		(cd $${dir} && rm -Rf node_modules); \
  	done
.PHONY: uninstall
