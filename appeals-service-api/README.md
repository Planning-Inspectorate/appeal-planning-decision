# Appeals Service API

The microservice API for the appeals service

## Commands

All these are to be run with `npm run <command>`.

- `format`: rewrites the source code to the Prettier spec
- `lint`: test the JS style is correct (fix issues with `npm run lint -- --fix`)
- `start`: starts the application
- `start:dev`: starts the application in development mode, with live reload
- `test`: runs the unit test suite
- `test:cov`: runs the unit test suite and tests coverage
- `test:watch`: runs the unit test suite and watches for changes

## Endpoints

- GET:/appeals - get all appeals (@todo - apply pagination/filtering)
- POST:/appeals - create a new appeal
- DELETE:/appeals/:uuid - delete an appeal
- GET:/appeals/:uuid - get a specific appeal
- PUT:/appeals/:uuid - update a specific appeal

## Project Structure

This application will be deployed as a separate, non-publicly exposed service.
It exists to allow the Forms Web App to interact with the database

 - `/src` - contains the application.
 - `/src/controllers` - the application controllers.
 - `/src/lib` - any common "library" files.
 - `/src/routes` - the HTTP endpoints to be created.
 - `/src/schema` - the Mongoose models. Business logic should be in here.
 
### Config

See `/src/lib/config.js`

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
