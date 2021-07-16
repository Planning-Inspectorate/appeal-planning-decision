# Authentication Service API

The microservice API for the authentication service.

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
It exists to allow the LPA Reply Web App to interact with the database


 - `/src` - contains the application.
 - `/src/controllers` - the application controllers.
 - `/src/lib` - any common "library" files.
 - `/src/routes` - the HTTP endpoints to be created.
 
### Config

See `/src/lib/config.js`

This application is built to the [12 Factor App](https://12factor.net/)
standards. This means that there is a single configuration file and any specific
variables required are declared as environment variables.
