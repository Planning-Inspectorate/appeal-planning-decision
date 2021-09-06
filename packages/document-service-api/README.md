# Document Service API

The microservice API for the document service

## Commands

All these are to be run with `npm run <command>`.

- `format`: rewrites the source code to the Prettier spec
- `lint`: test the JS style is correct (fix issues with `npm run lint -- --fix`)
- `start`: starts the application
- `start:dev`: starts the application in development mode, with live reload
- `test`: runs the unit test suite
- `test:cov`: runs the unit test suite and tests coverage
- `test:watch`: runs the unit test suite and watches for changes

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

### Accessing local blob storage

The document service has a local container that mimics the same functionality the Azure blob storage provides, to browse the storage you need to [download Azure Storage browser](https://azure.microsoft.com/en-gb/features/storage-explorer/).

First you'll need to [configure and run the development stack](https://github.com/Planning-Inspectorate/appeal-planning-decision/blob/master/README.md) and then find the BLOB_STORAGE_CONNECTION_STRING from the [docker-compose.yml](https://github.com/Planning-Inspectorate/appeal-planning-decision/blob/master/docker-compose.yml) file in the project root.

Go into Azure Storage Browser, select the connection icon from the bar on the left, select `Local storage emulator` and enter the following:

```
Account name: <Use the AccountName param from the connection string>
Account key: <Use the AccountKey param from the connection string>
Blobs port: <Use the port from the BlobEndpoint param in the connection string>
Queues port: <Use the port from the QueuesEndpoint param in the connection string>
Tables port: 10002
```

Then click Next then Connect.

To see the documents, in the Explorer select `Storage Accounts`, then the connection you just set up (probably `local-1`), then `Blob Containers`, then `document-service-uploads`.

Within `document-service-uploads` the document hierarchy is structured as follows:

- Application UUID folder
  - Document UUID folder
    - Document file

To see the metadata for a document, navigate to the desired document, right click the document and select `Properties`.
