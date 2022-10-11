# Document Service API

The microservice API for the document service

## Engineering Backlog

1. Remove tests: there are lot of tests that are overly mocked so have little value, and actively work against us improving the
codebase. Where possible, try to move to high-level testsing as demonstrated in `test/developer/eveloper.test.js`. See
[🚀 TDD, Where Did It All Go Wrong?](https://www.youtube.com/watch?v=EZ05e7EMOLM) for an explanation of why we're taking this approach.
  1. Remove `test/utils`: largely useless without the overly-mocked tests plus [Utility classes are evil](https://www.vojtechruzicka.com/avoid-utility-classes/).
1. Break dependencies on packages outside of this one so that the API is self=contained and can then be owned by a more appropriate team.
1. Clean-up architecture
  1. Files in `controllers` aren't controllers, whereas files in `routes` are. Files in `controllers` look like services?
  1. `schema` files are confusing (`documentsMethods` doesn't contain model schemas?)
    1. Is Mongoose necessary? It seems to incur a maintenance cost and we're not sure why this cost has been incurred?
1. Clean-up `routes` (see `TODO`s in files)
1. Improve container image build times to improve CI/CD and utlimately, Accelerate metrics.

## Commands

All these are to be run with `npm run <command>`.

- `format`: rewrites the source code to the Prettier spec
- `lint`: test the JS style is correct (fix issues with `npm run lint -- --fix`)
- `start`: starts the application
- `start:dev`: starts the application in development mode, with live reload
- `test`: runs the unit test suite
- `test:cov`: runs the unit test suite and tests coverage
- `test:watch`: runs the unit test suite and watches for changes

## Feature Development and Rollout

We are currently using feature flags (provided by Azure, see [here](https://learn.microsoft.com/en-us/azure/azure-app-configuration/manage-feature-flags)) to develop new features and roll them out. The reasons for this are:

1. We can phase release new features easily, reducing their "blast radius". This reduces the workload associated with
triaging bugs

2. We can do load testing "in the wild", reducing the burden on QAs and preventing over-engineering.

3. We can A/B test new features, making designers' lives easier.

4. We can reduce the number of intermediate environments between local development and pushing to production.

5. Enables trunk-based development since parallel work can be done in feature isolation on the code base.

6. Can do cross-team work in a more coordinated fashion since all services that need modifying can point to the same feature flag during development, and all associated code can be enabled across services at the same time.

### Developing using feature flags

This service uses a `local planning authority code`, which should be derived from the headers of requests coming through to the API,
to control what users can access features. This is because we do not need to go to the level of individual users in the project! This
information should be included as a header since headers are intended to hold request-specific context information, and this information
may not be used for every request. This is opposed to including this information in the request body where all information should be used
as part of the request.

Due to the single-threaded nature of Node, it's very difficult to get thread-local contexts per request in order to use request-specific 
information to determine is a feature flag is enabled or not. For example, our attempts to access a local planning authority code without
passing that parameter through the method calls to where we wanted to add the feature flag were ultimately fruitless. Instead, we have
decided to pass the `local planning authority code` through the relevant call stack until the feature flag check is performed.

The following process should be used to develop features in this code-base:

1. Set-up the feature flag on Azure: ensure its disabled, and has a `User` with value `E69999999` ('System Test Borough Council') added to it. 
This is the local planning authority that QAs use for end-to-end testing!
1. Mock the feature flag method to build out the new feature so that we don't incur a dependency on the Azure feature manager during
development (this can lead to false negatives/positives). It also ensures that we don't hit the rate limit for Azure! We only want to hit
the Azure feature manager when running code in production. The feature flag can be mocked in Jest with the following code: `jest.mock('../../src/lib/featureFlag', () => ({ isFeatureActive: () => true }));`
1. As engineers are satisfied that the feature is complete, enable the feature-flag on Azure, and start to run E2E tests with QAs.
1. If the feature passes QA validation, add in more and more `local planning authority code`s to the feature's configuration in the Azure 
feature management portal, according to the rollout plan for the project.
1. When the feature has been entirely rolled out:
  1. Remove the feature flag references for the feature throughout the code base, and all `local planning authority code` references for the 
  feature in the call stack.
  1. Remove feature flag mocks from feature tests.
  1. Remove the feature flag from Azure.

## Feature under development

1. AS-5031: ready for E2E testing

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

First you'll need to [configure and run the development stack](https://github.com/Planning-Inspectorate/appeal-planning-decision/blob/main/README.md) and then find the BLOB_STORAGE_CONNECTION_STRING from the [docker-compose.yml](https://github.com/Planning-Inspectorate/appeal-planning-decision/blob/main/docker-compose.yml) file in the project root.

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

### Metadata migration tool

Document metadata is now being stored as attributes of the document in Blob Storage instead of in Cosmos DB. This tool provides a way to migrate the existing document metadata from Cosmos DB to Blob Storage.

The tool gets the metadata records from Cosmos DB, formats them and saves them to the corresponding document in Blob Storage. This way the metadata for the documents in Blob Storage is overwritten each time the tool is run so it can be run multiple times without duplicating any metadata and any documents that already have metadata in Blob Storage and don't have an associated Cosmos DB record will be ignored.

To use, [configure and run the development stack](https://github.com/Planning-Inspectorate/appeal-planning-decision/blob/main/README.md) and go to http://localhost:3001/api/v1/migrate-metadata.

The output will include the following:

- Number of documents found
- Number of documents migrated
- Old and new metadata for each migrated document

In the event of an error, a message will be returned with the id of the document that failed and a reason for the failure. Once the data has been fixed the tool can be run again.

See http://localhost:3001/api-docs/#/Document/migrateMetadata for more information, including examples of the output and error message.
