SERVICES_DIR ?= "services"

down:
	docker-compose down
.PHONY: down

install:
	(cd data && npm ci)

	for dir in ${SERVICES_DIR}/*; do \
		(cd $${dir} && npm ci); \
  	done
.PHONY: install

serve:
	docker-compose up
.PHONY: serve

uninstall:
	(cd data && rm -Rf node_modules)

	for dir in ${SERVICES_DIR}/*; do \
		(cd $${dir} && rm -Rf node_modules); \
  	done
.PHONY: uninstall
