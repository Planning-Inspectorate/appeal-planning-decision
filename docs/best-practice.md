# Best practice/code conventions

1. [Source Code Structure](#Source-Code-Structure)
1. [Dynamic Forms](#Dynamic-Forms)
1. [Dependencies](#Dependencies)
1. [Auth](#auth)
1. [Feature Flags](#Feature-Flags)
1. [Logging](#Logging)
1. [Secrets](#Secrets)
1. [ORM/Prisma](#ORM)
1. [Types](#Types)
1. [Data Models](#Data-Models)
1. [API Spec](#API-Spec)

## Source Code Structure

- Going forward we are moving to a [file based routing system](packages/common/src/router/readme.md) for our APIs and attempting to keep code + tests for a feature together in a folder
- this is moving away from the previous structure of having folders for routes/controllers/services although a lot of code still exists in the previous structure, this will hopefully be being removed in the future as it mostly relates to V1 appeals that are sent to legacy back office system 'Horizon'

### Test structure

Going forward we wish to keep our tests next to the code they are testing

- unit tests will use `.test.js`
- integration tests will use `.spec.js`

Write integration tests for all API endpoints

Integration tests are not needed in forms-web-app or packages that are not run such as business-rules/common

Snapshot tests can be run for forms-web-app, if doing this ensure to use as little mocking as possible e.g. only mock calls to external services such as apis.

Previously unit tests lived under a dir with the following pattern `__tests__/unit/` and integration tests lived under `__tests__/developer/` so integration and unit tests could be ran separately, many of these exist but use the above strategy instead

### Business Rules

Holds any business rule calculations so they can be reused across different packages e.g. deadline dates that vary by appeal type

### The Common Module

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

## Dynamic Forms

Dynamic Forms/Journeys are a concept used to make the creation of multi page forms quicker as the service has a large quantity of questions that vary based on appeal type

See:

- [Question components](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/1521877020/Question+components)
- [Journey Types](/packages/common/src/dynamic-forms)
- [Dynamic Forms](/packages/dynamic-forms/readme.md)

## Dependencies

You will need to install the dependencies locally, even though we're using
Docker Compose to run locally.

Run `npm ci` in the root of the repo to install all dependencies.

As we are using a workspace in order to add new dependencies run install in root:

```sh
npm install <new-package>
```

Then add a versionless reference for each workspace package that uses it e.g.

```json
"express": "*"
```

This ensures the version is handled once across all packages, although we can specify multiple versions if necessary

Docker files omit unrequired packages to keep the image as slim as possible

```sh
npm ci --workspaces --if-present --omit=dev
```

## Auth

API clients are added to the express request object by middleware and internally add users' auth tokens when calling APIs `req.appealsApiClient` and `req.docsApiClient`, with no user a client credentials token is sent instead.

Ensure all api requests check for a token, and if necessary checks the user can access that specific resource

## Feature Flags

We have incorporated Azure feature flag functionality into the common package for use across the solution. Feature flags should be set up via terraform and can be configured (enabled/disabled/users set) via portal under the 'app configuration' section, where you can select your desired environment and find all available flags accordingly, flags can be used within the codebase by importing the `isFeatureActive` function from the FeatureFlag file in your current package, i.e;

> Feature flags - terraform seems to have a bug with syntax when changing user targeting rules for feature flags, change them manually and update the terraform afterwards to avoid this

```
  const { isFeatureActive } = require('{{featureFlagFileLocation}}');
```

and then specifying the name of the feature flag in the parameters, i.e.:

```
  if (isFeatureActive(FLAGS.HAS_APPEAL_FORM_V2)) {
    `feature implementation goes here`
  }
```

N.B a feature flag enum analog is available in `packages/common/src/feature-flags.js`

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

## Secrets

> never store sensitive information in the repo. Always store it in an Azure Key Vault.
> [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/basic-concepts)

The access rights to both of these Key Vaults are done on a least-privilege basis

## ORM

The ORM used by the application to access SQL Server is [Prisma](https://www.prisma.io/). The schema is defined in [schema.prisma](./packages/appeals-service-api/src/db/schema.prisma).

**Note:** If the `prisma.schema` file has been updated, don't forget to run `npm run db:migrate:dev` to apply the changes.

## Types

Though we use JavaScript, which uses [dynamic & weak typing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#dynamic_and_weak_typing), we want to be type safe to help reduce bugs. To do this we define types using [jsdoc](https://jsdoc.app/), [Prisma](https://www.prisma.io/) (for database types), and [TypeScript](https://www.typescriptlang.org/) (only type defintion files, no code).

### Prisma Types

In the `packages/appeals-service/api` package, to import Prisma types in jsdoc, use

```
import('@prisma/client').MyType
```

Types for creates or updates may not have all fields, so use the `*CreateInput` or `*UpdateInput` variations for those:

```
import('@prisma/client').Prisma.MyTypeUncheckedCreateInput
// or
import('@prisma/client').Prisma.MyTypeUncheckedUpdateInput
```

If you need a type with a relation included, say an `AppealUser` with a `SecurityToken`, you can use:

```
import('@prisma/client').Prisma.AppealUserGetPayload<{include: {SecurityToken: true}}>
```

This type will have a `.SecurityToken` property with the fields from that model.

## Data Models

In Appeals FO we have multiple models or entities. Some comply with the PINS [data model](https://github.com/Planning-Inspectorate/data-model), others are for FO use only. There are a number of conventions it is helpful to be aware of:

**Submissions**

Submissions, such as appeal submissions, are authored in the Front Office by our users. We _submit_ them to the back office. This includes appeals, LPA questionnaires, and others. We own this data, and this data is only useful until it is submitted - once submitted we no longer show them to users, after that the back office version is the source of truth.

> Note: currently V1 appeal submissions are saved in Cosmos in `appeals` and sent to the legacy Horizon service. V2 appeals are held in SQL `AppellantSubmission` and forwarded to Back Office. Both can be viewed in the appellant's dashboard but only V2 are progressed

**Cases**

Appeals start life in the front office as submissions, once received by the Back Office, they become appeal cases. We receive these from back office over service bus, and save them in the `AppealCase` table, along with associated data.

## API Spec

Our API specifications are documented using an [OpenAPI Spec](https://swagger.io/specification/). We use `swagger-jsdoc` to generate the final spec from source code comments and yaml files; this is generated when the app starts.

Use a `.yaml` file for shared components, and an `*.spec.yaml` file with `path` definitions on each router file. See [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/) for more information.

e.g.

```
// contains the router code
appeals.js
// contains the route/path specifications
appeals.spec.yaml
```

### API Types

To use the API types from another package, use `import` like this:

API response type

```
/**
 * @typedef {import('appeals-service-api').Api.AppealCase} AppealCase
 */
```

DB schema type

```
/**
 * @typedef {import('appeals-service-api').Schema.AppealUser} AppealUser
 */
```

### Updates

When updating the API spec, generate the corresponding types with:

`packages/appeals-service-api> npm run gen-api-types`

which will update `packages/appeals-service-api/src/spec/api-types.d.ts`, as a result, do not update this file manually as changes will be lost following the next auto generation
