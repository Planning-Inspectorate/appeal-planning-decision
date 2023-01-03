# Appeals Service API

The microservice API for the appeals service

## Feature Flag

We have incorporated Azure feature flag functionality into this repo. Feature flags should be set up in the infra, and can be used by importing the `isFeatureActive` function from `src/configuration/featureFlag`, and specifying the name of the feature flag in the parameters, i.e.:

```
if (isFeatureActive('send-appeal-direct-to-horizon-wrapper')) 
    { feature implementation goes here }`
```

## Horizon Integration

We encountered some issues with the previous Horizon integration concerning the message queue: specifically, the message queue has been silently dropping messages without error, and without adding these messages to the dead letter queue. As a work around we have temporarily updated the codebase to include a direct integration via the `'send-appeal-direct-to-horizon-wrapper'` feature flag, skipping the queue step, to isolate the problem. In the longer term, when we have greater understanding of the Azure message queue, the intention is to reimplement the message queue.

## Commands

All these are to be run with `npm run <command>`.

- `format`: rewrites the source code to the Prettier spec
- `lint`: test the JS style is correct (fix issues with `npm run lint -- --fix`)
- `start`: starts the application
- `start:dev`: starts the application in development mode, with live reload
- `test`: runs the unit test suite
- `test:cov`: runs the unit test suite and tests coverage
- `test:watch`: runs the unit test suite and watches for changes
- `test:tdd`: runs the unit tests and watches all files for changes

## Endpoints

The API spec doc is available at `/api/openapi.yaml`.
The app will serve this at the `/api-docs` endpoint.

## Project Structure

This application will be deployed as a separate, non-publicly exposed service.
It exists to allow the Forms Web App to interact with the database

- `/src` - contains the application.
- `/src/controllers` - the application controllers.
- `/src/lib` - any common "library" files.
- `/src/routes` - the HTTP endpoints to be created.

### Config

This application is built to the [12 Factor App](https://12factor.net/)
standards. This means that there is a single configuration file and any specific
variables required are declared as environment variables.

### Logging

See `/src/lib/logger.js`

This application uses [Pino](http://getpino.io). All logs are sent to the
STDOut so they can be picked up when deployed by the Kubernetes pod(s). It
is important to use the log levels (trace, debug, info, warn, error, fatal)
appropriately so that filtering can be done during production.

Also installed is `express-pino-logger` which add `req.log` to the incoming
HTTP request. This automatically logs incoming HTTP requests and apply a unique
correlation ID to make tracing errors through easier. For the most part, this
should be the instance used for logging.
