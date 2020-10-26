# Appeal Planning Decision 

Monorepo for all PINS Appeal planning decision services and infrastructure

## Pre-requisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running

> Docker and Docker Compose are both very well documented. Please check their
> documentation for advice on running it in development.

To run the development stack, you can run this in Docker Compose. This will
run all services, including databases, and pre-fill all stubbed data into the
databases.

To run the whole stack:

```
docker-compose up
```

Then go to [localhost:3000](http://localhost:3000)

> As a convention, public facing web service will use the port range `9000-9999`
> and API services will use the port range `3000-3999`

To run a single service (and it's dependencies):

```
docker-compose run --rm --service-ports appeals-service-api-data
```

This will run just the `appeals-service-api-data` app. Change the name for
different services.

---

If you wish to use the shell of the container (useful if you want to install
new npm dependencies):

```
docker-compose run --rm --service-ports appeals-service-api-data sh
```

---

To stop all services:

```
docker-compose down
```
