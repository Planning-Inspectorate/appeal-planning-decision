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

### Accessing local blob storage.

The document service has a local container that mimics that same functionality the azure blob storage provides, to browse the storage you need to download Azure Storage browser from [here](https://azure.microsoft.com/en-gb/features/storage-explorer/).

You then need to retrieve the BLOB_STORAGE_CONNECTION_STRING from docker-compose.yml at the project root. At the time of writing it is:

```DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://blob-storage:10000/devstoreaccount1;QueueEndpoint=http://blob-storage:10001/devstoreaccount1;```

Simply replace the host in the connection string with 'localhost' like so and the port numbers to the correct one for the dockerized service:

```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:4002/devstoreaccount1;QueueEndpoint=http://localhost:4003/devstoreaccount1;
```

Go into Azure Storage Browser select the connection icon from the bar on the left, select "Storage Account", "Shared Access signature" then give your connection a name and paste in your connection string.
