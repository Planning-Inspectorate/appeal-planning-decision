# Appeal Planning Decision

Monorepo for all PINS Appeal planning decision services.

> Note: some documentation also lives in [docs](./docs).

## TL;DR

- `npm ci`
- `make serve`
- once the server is running, to populate the Local Planning Authorities database, run: `npm run populate-db`
- Go to [localhost:9003/before-you-start](http://localhost:9003/before-you-start)

## Pre-requisites

- [NodeJS v18](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## NodeJS

Install NodeJS using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```
nvm install 20.17.0
nvm use 20.17.0
nvm alias default 20
```

### Dependencies

You will need to install the dependencies locally, even though we're using
Docker Compose to run locally.

Run `npm ci` in the root of the repo to install all dependencies.

Add new dependencies in the usual way:

```
npm install <new-package>
```

### Database Setup

#### Database Server Setup

A SQL Server database server is required for the api to run. This will start automatically with docker compose. However it is required to migrate and seed the database which can be done from scripts in the database package.

First, make sure you have a `.env` file in `./packages/database` (you can copy the `.env.example`) and it has `SQL_CONNECTION_STRING` and `SQL_CONNECTION_STRING_ADMIN` environment variables defined with details pointing to your local database server (`mssql` Docker container). These values will/can be the same for local development (admin is used for migrations, the other one for the seeding).

To set up the SQL Server with tables and some data, you will need to run the following commands (whilst the SQL Server Docker container is running. You can run it by running the appeals service api or forms web app. For example: `make run SERVICE=appeals-service-api`. Alternatively, you can run the Docker container called 'mssql' manually using the Docker interface):

```shell
npm run db:generate
npm run db:migrate:dev
npm run db:seed 
```
**npm run db:generate:** To generate the client from the schema
**run db:migrate:dev:** To apply changes → Creating the database and tables (this will also run seed)
**run db:seed :** Populating the database with some initial data

The ORM used by the application to access SQL Server is [Prisma](https://www.prisma.io/). The schema is defined in [schema.prisma](./packages/appeals-service-api/src/db/schema.prisma). 

**Note:** If the `prisma.schema` file has been updated, don't forget to run `npm run db:migrate:dev` to apply the changes.

#### SQL Azure
In Azure we have manually created a login/user with db_datareader and db_datawriter roles

The following is run against the server:

```sql
CREATE LOGIN [loginname] WITH PASSWORD = 'password';
```

The following is run against the DB:

```sql
create USER [username] for login [loginname];
ALTER ROLE db_datareader ADD MEMBER [username];
ALTER ROLE db_datawriter ADD MEMBER [username];
```

##### Azure Data Studio

[Azure Data Studio](https://learn.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio) or the [MSSQL VS code extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) can be used as a database client, to create and monitor the database contents.

Install Azure Data Studio or the VS code extension, and connect to the SQL server by using the credentials specified below:

**Server:** localhost
**Authentication type:** SQL Login
**User name:** sa
**Password:** DockerDatabaseP@22word!
**Database:** pins_front_office_development
**Trust server certificate:** True

## Running

> Docker and Docker Compose are both very well documented. Please check their
> documentation for advice on running it in development.

To run the development stack, you can run this in Docker Compose. This will
run all services, including databases, and pre-fill all stubbed data into the
databases.

To run the whole stack

With make:

```
make serve
```

With npm: 

```
npm run docker:all
```

You can run less services at once using a combination of profiles and compose files

see the following make/equivalent npm scripts

```
make slim
make appeals
make comment
```

```
npm run docker:slim
npm run docker:appeals
npm run docker:comment
```

You can add more LPAs to the db - once the server is running go to the `/packages/appeals-service-api/data` directory and run: `curl -X POST -d @lpa-list.csv http://localhost:3000/api/v1/local-planning-authorities`

Then go to [localhost:9003/before-you-start](http://localhost:9003/before-you-start) (forms-web-app) or
[localhost:3000](http://localhost:3000) (appeals-service-api)

> As a convention, public facing web service will use the port range `9000-9999`
> and API services will use the port range `3000-3999`

To run a single service (and it's dependencies):

```
make run SERVICE=appeals-service-api
```

This will run just the `appeals-service-api` app. Change the `SERVICE` for
different services.

---

If you wish to use the shell of the container (useful if you want to install
new npm dependencies):

```
make run SERVICE=appeals-service-api CMD=sh
```

---

To stop all services:

```
make down
```

## The Common Module

The [Common](/packages/common) contains a series of common functions that are used across
microservices. The applications use this as an external dependency (`@pins/common`)
but is included as a local file in the `package.json`.

In Docker Compose, this is included as a mounted volume to `/opt/common`.

In the Dockerfile, this pulls the files from a Docker image called "common" - this
is actually built separately in the CI/CD pipelines. If you need to build the Docker
image separately, you must build the common image separately:

```
docker build -t common ./common
```

## Branching

Please follow the established [branching strategy](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/425132090/Branching+strategy).
In the event of divergence from the README, the external document will take
precedence.

All commit messages must be written in the [Conventional Commit Format](#commit-message-format).
This uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)
to generate the release numbers for the artifacts.

## Commit Message Format

This repo uses [Semantic Release](https://semantic-release.gitbook.io) to
generate release version numbers, so it is imperative that all commits are
done using the [correct format](https://www.conventionalcommits.org/en/v1.0.0/#specification).

Commits to the `develop` branch will create release candidates. These are a release
of software that may or may not be made public. Under normal circumstance, releases
should be made directly to the `main` branch.

## Commit Message Rules

Commit messages dictate how the software is released. You must ensure that you are
using the correct commit type. Commit messages starting `feat` or `fix` will trigger
a new release - other types such as `chore`, `docs` or `test` won't create a new
release. These should be used appropriately - for instance, if you are refactoring the
repo structure without changing any of the application, this would be appropriate to
use `chore`. If you are fixing a bug then `fix` should be used. A new feature should
use the type `feat`.

You can mix-and-match inside a PR - the CI/CD pipelines will take the highest ranked
commit type and make a release based on that. For instance, a PR with many `chore`
and one `feat` will produce a new release bumping the minor semantic version number.
Without the `feat`, it would create no new release.

## Checking The Correct Release Has Been Deployed

1. Check your PR has passed. If there are any failures, check these to see if the
   reasons for failure give a clue as to what went wrong (and then fix). There is a job
   called `Next version` which will tell you the version number that this should create
   if successful.
2. Check a [new release was made](https://github.com/Planning-Inspectorate/appeal-planning-decision/releases).
   Dependent upon whether it was made from the `develop` or `main` branch, you will be
   looking for either a pre-release version or a release. If no release has been made,
   ensure that your commit message was formatted correctly and begins with `feat` or `fix`.
3. Check the [/releases](https://github.com/Planning-Inspectorate/appeal-planning-decision/tree/main/releases)
   folder against the cluster you are expecting to see it deployed on. If the `app.yml` file does
   not contain the tag you are expecting then the deployment may have failed. It takes up to
   5 minutes for a new release to be detected.

## Ensure Linear Commits

It's very important that PRs have linear commits. There can be multiple commits per PR
(if appropriate), but they should be linear. An example of a non-linear commit is:

```shell
7fa9388 (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
bf2a09e erm, not sure why CI has broken so another go
067c88e gah, I'm stupid. I can see why CI broke
```

This is not linear because you're fixing something inside the PR. This should be [rebased](https://github.com/Planning-Inspectorate/appeal-planning-decision/wiki/An-intro-to-Git-Rebase)
so it's linear:

```shell
6fd721a (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
```

Linear commits are much easier to find problems when tracing through Git history.

## Commitizen

To automatically generate the format correctly, please use Commitizen to make
all commits to this repo. This repo is
[Commitizen-friendly](https://github.com/commitizen/cz-cli).

There is linting on commit messages in the repo, both in GitHub Actions and
as a commit hook.

Either:

    npm install -g commitizen

And then:

    git add .
    git cz

Or:

    git add .
    npm run commit

## Terraform

[Terraform](https://www.terraform.io/) is used to provision the infrastructure in Azure. The state is stored in Azure Blob Storage.

The code for infrastructure is in [infrastructure-environments](https://github.com/Planning-Inspectorate/infrastructure-environments)



## Secrets

> tl;dr never store sensitive information in the repo. Always store it in an Azure Key Vault.
[Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/basic-concepts)

There are two Key Vaults available to each deployment:

- Environment. As part of the infrastructure deployment process, a Key Vault is created for each environment. This should
  only be used to store automatically generated data, such database configuration. There is a job to extract variables from
  the Terraform job and put them into this Key Vault. As this Key Vault is managed by Terraform, it should only have secrets
  stored in here that are automatically generated - anything manually added may get lost.
- PINS. In the PINS Azure subscription, there is a manually created Key Vault. The purpose of this is for PINS Staff to
  be able to inject data into this infrastructure without ever having to transmit it insecurely. This is only available to
  PINS staff so there is no loss in the chain of custody of data. Any secrets that you wish to store manually (eg, a
  token generated for a third-party service, such as Notify) must be stored in here. There is only one of these Key Vaults,
  so this is designed as the global Key Vault.

The access rights to both of these Key Vaults are done a least-privilege basis and should only ever have `GET` access.
Even `LIST` could produce a vulnerability so should never be granted.

## GOV.UK Notify integration

The following environment variables are required to integrate with the GOV.UK. Notify service:

```shell
SRV_NOTIFY_API_KEY: 'some-valid-notify-api-key'
SRV_NOTIFY_TEMPLATE_ID: '15ed37a9-506c-4845-88ea-95502282a863'
```

Notes on optional environment variables:

- If `SRV_NOTIFY_BASE_URL` is not provided then the correct default value i.e. `https://api.notifications.service.gov.uk` will be assumed by the client automatically.
- If `SRV_NOTIFY_SERVICE_ID` is not provided then the client will obtain this value from the api key automatically.
- If `SRV_NOTIFY_SERVICE_ID` is provided then it must be valid to avoid 403 responses.

A mock Notify service is available. The mock service requires the following environment variables:

```shell
      SRV_NOTIFY_BASE_URL: http://mock-notify:3000
      SRV_NOTIFY_SERVICE_ID: 'dummy-service-id-for-notify'
      SRV_NOTIFY_API_KEY: 'dummy-api-key-for-notify'
      SRV_NOTIFY_TEMPLATE_ID: 'dummy-template-id-for-notify'
```

## Logging

> Please see [Confluence](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/edit-v2/554205478) for further information

tl;dr If in controller/middleware, use `req.log`, otherwise `*/src/lib/logger.js`. We use the logger [Pino](http://getpino.io),
and [pino-http](https://github.com/pinojs/pino-http).

### Logging Levels

This is an overview of the different levels available in Pino, in order of least to most verbose.

| Level | Description                                                                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fatal | To be used if the application is going down. Typically this won't be used in the application.                                                                                                           |
| Error | To be used if an error has occurred. This will most likely be a `try/catch` but not exclusively. If an `Error` object is present, always send it to the logger - `log.error({ err }, 'error message')`. |
| Warn  | To be used when something has happened that is not ideal, but may not result in an error being thrown. Typically, this would be used when a user has failed validation.                                 |
| Info  | To be used when recording normal information about a process. This is likely to be the most used level.                                                                                                 |
| Debug | Information to be used when debugging a problem.                                                                                                                                                        |
| Trace | The most verbose level.                                                                                                                                                                                 |

### try/catch

Always log try / catch statements. Good practice:

```javascript
try {
	log.debug('this is something happening');
} catch (err) {
	log.error({ err }, 'error message');
	throw err;
}
```

### Child

Sometimes it makes sense to logically group log messages. We can achieve this with a [child logger](https://getpino.io/#/docs/child-loggers).
Typically, you will need to add some identifying detail to associate the logs together, a good example would be using `uuid.v4()`.

```javascript
const log = logger.child({ someId: uuid.v4() });
log.info('an informational message');
```

## Data Access

Developers are granted access to the data stores in the Dev and PreProd environments. No sensitive data is stored in
these environments making is appropriate for developer access.

To access the data, please use the [Azure Portal](https://portal.azure.com).

### CosmosDB (MongoDB)

> [Azure Docs](https://docs.microsoft.com/en-us/azure/data-explorer/)

- Login to portal.azure.com
- Search for "Azure Cosmos DB"
- Select the instance you wish to view (Dev or PreProd)
- Select "Data Explorer"

### Blob Storage

> [Azure Docs](https://azure.microsoft.com/en-gb/updates/storage-explorer-preview-now-available-in-azure-portal/)

- Login to portal.azure.com
- Search for "Storage accounts"
- Select the instance you wish to view (Dev or PreProd)
- Select "Storage Explorer (preview)"
- Select "BLOB CONTAINERS"

### Source Code Structure

Where appropriate the source code must be split out into a hierarchy by appeal type. Several examples of this may be found under cypress tests (i.e. /packages/e2e-tests/cypress/integration), forms-web-app (i.e. /packages/forms-web-app/src/routes/), and many others.

### Test structure

On a per project basis, unit tests should live under a dir with the following pattern __tests__/unit/ and integration tests should live under __tests__/developer/, this is so integration and unit tests can be ran separately.

UAT test packages requiring cypress have been moved to live under a route of /test-packages/ so they can be built and linted separately.

## Feature Flag

We have incorporated Azure feature flag functionality into the common package for use across the solution. Feature flags should be set up via terraform and can be configured (enabled/disabled/users set) via portal under the 'app configuration' section, where you can select your desired environment and find all available flags accordingly, flags can be used within the codebase by importing the `isFeatureActive` function from the FeatureFlag file in your current package, i.e; 

```
  const { isFeatureActive } = require('{{featureFlagFileLocation}}');
```

 and then specifying the name of the feature flag in the parameters, i.e.:

```
  if (isFeatureActive(FLAGS.HORIZON_DOCUMENT_LABELLING)) { 
    `feature implementation goes here`
  }
```

N.B a feature flag enum analog is available in `packages/common/src/feature-flags.js`

## Common issues and fixes

### Document service API crashes on startup with error "Invalid connection string"

The connection string for `document-service-api` can be configured in the root `docker-compose.yml`. Under `environment:`, there should be a variable named `PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING` (add this if it's not already present). This should be populated with the connection string found on the Azure Access Keys page. For local development, this will be pins-asc-appeals-dev-ukw-001 access keys > Read-Write keys > Primary key > Connection string.


## Architecture

The architecture of the Appeals Back Office service and it's relationships with other systems can be viewed through interactive [C4 Model diagrams](https://c4model.com) held as [Structizier](https://docs.structurizr.com) code in the `structurizr/workspace.dsl` file

This can be viewed locally through an interactive web interface by running `make c4`

Finally open your web browser to view [http://localhost:8082](http://localhost:8082)
