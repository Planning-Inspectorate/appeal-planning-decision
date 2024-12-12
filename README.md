# Appeal Planning Decision

Appeal A Planning Decision Service Front Office monorepo

- Please follow the [commit strategy](./docs/commit-strategy.md)
- Please follow the repo's [best practice](./docs/best-practice.md)

This repo is designed to provide a front end for various users involved in making and managing an appeal made to the [Planning Inspectorate](https://www.gov.uk/government/organisations/planning-inspectorate)

**Table Of Contents**

1. [Appeals process](#Appeals-process)
1. [Running locally](#Running-locally)
1. [Additional Tools](#Additional-Tools)
1. [Architecture](#Architecture)
1. [Further information](#Further-information)
1. [Related Repos](#Related-Repos)

## Appeals process

- A member of public contacts the Planning Inspectorate to make an appeal a decision made by their Local Authority, they become an 'Appellant'
- Someone may do this on behalf of an appellant and so become an 'Agent'
- The Local Authority responds to this appeal
- Members of the public can comment on the appeal as an 'Interested Party'
- Interested parties can apply to be granted 'rule 6' status which if approved grants additional permissions to have more of a say along the appeal process
- The Planning Inspectorate collects representations from these user groups and issues a decision (staff access/manage appeals via [appeals-back-office](https://github.com/Planning-Inspectorate/appeals-back-office))
- Main Parties may have the opportunity to make a 'final comment' on the appeal after the decision has been made

## Running locally

__Requirements__

- Docker
- Node 20 (recommended to install via nvm) 

```sh
nvm install 20
nvm use 20
```

__Initial setup__

- create an `.env` file in the [/packages/database](./packages/database) (copy the `.env.example`)
- create an `.env` file in [/packages/document-service-api](./packages/document-service-api) (copy the `.env.example`)
- `npm ci`
- `make database`
- `npm run db:generate`
- `npm run db:migrate:dev`
- stop the database container
- `make serve`
- `npm run documents:seed`

For windows either use WSL or copy the command for the appropriate step from the Makefile

> If you have trouble running everything at once you can try `make slim` which attempts to mock some additional packages but won't provide full functionality. There are additional make commands to run smaller subsections of the service e.g. `make database` used in the above steps

__Subsequent runs__

The npm package installation and database commands will only need to be run if something has changed during a git pull or has modified locally, otherwise simply run:

```sh
make serve
```

> if you cannot progress beyond the 'before you start' page without encountering an error page, it's likely the APIs are down, the most likely cause is that there's been a change to the database so run `npm run db:migrate:dev`

__Seeding Data__

- SQL database Seeding is run by `npm run db:seed` this is run automatically with `npm run db:migrate:dev` and the code for it is in [packages/database/src/seed](./packages/database/src/seed/)
- Mongo database seeding is handled in docker compose via [/dev/data](./dev/data/README.md)
- Documents seeding is done via `npm run documents:seed` currently this only adds 1 document into back office storage (example.txt)

__Access once running__ 

- The website runs locally on [http://localhost:9003/](http://localhost:9003/) (forms-web-app)
- Use `12345` for any email confirmation codes locally
- Any email address can be used to [Make an appeal](http://localhost:9003/) but `appellant1@planninginspectorate.gov.uk` has some seeded data
- Use `admin1@planninginspectorate.gov.uk` on [/manage-appeals/your-email-address](http://localhost:9003/manage-appeals/your-email-address) to act as a Local planning authority (LPA)
- Use `r6-1@planninginspectorate.gov.uk` to act as a [/rule-6/email-address](http://localhost:9003/rule-6/email-address) on an appeal
- You can search and comment on an existing appeal via [Comment on a planning appeal](http://localhost:9003/comment-planning-appeal/enter-postcode)

> if you get an ssl error, ensure you are connecting to http locally, your browser may be trying force a redirect to https, check your browsers settings to avoid this e.g. chrome://net-internals/#hsts

The application uses docker compose to run locally and the ports can be found in [docker-compose.yml](./docker-compose.yml)

- Most of the node services use a custom image that mounts your local files, this helps to enable debugging while running in docker 
- Some of the services use the underlying docker file used for production e.g. pdf-service-api
- External services are mocked via packages in [/dev](./dev)
- Some have variations held in `docker-compose.full.yml` and `docker-compose.slim.yml`
- As a convention, public facing web service will use the port range `9000-9999` and API services will use the port range `3000-3999`

## Additional Tools

- [Azure Data Studio](https://learn.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio) or the [MSSQL VS code extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) can be used as a SQL database client using the following local connection settings:
  - **Server:** localhost
  - **Authentication type:** SQL Login
  - **User name:** sa
  - **Password:** DockerDatabaseP@22word!
  - **Database:** pins_front_office_development
  - **Trust server certificate:** True

- [Mongo DB Compass](https://www.mongodb.com/products/tools/compass) can be used as a Mongo database client, connect with:
  - `mongodb://localhost:4000`
- [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/#Download-4) can browse local blob files, connect with:
  - **Account name:** `devstoreaccount1`
  - **Port:** `4002` (Front Office) `4004` (Back Office)

## Architecture

The architecture of the Appeals service and it's relationships with other systems can be viewed through interactive [C4 Model diagrams](https://c4model.com) held as [Structizier](https://docs.structurizr.com) code in the `structurizr/workspace.dsl` file

This can be viewed locally through an interactive web interface by running `make c4` open your web browser to view [http://localhost:8082](http://localhost:8082)

The latest version on `main` is published to github pages [https://planning-inspectorate.github.io/appeal-planning-decision](https://planning-inspectorate.github.io/appeal-planning-decision/master/appeals-front-office/container/) via a [github workflow](./.github/workflows/deploy-c4-diagrams.yml)

__tl;dr__

- forms-web-app - user facing website
- appeals-service-api - main api, handles all database data and sending messages to back office
- auth-server - OAuth implementation, sends confirmation tokens to emails and provides JWT tokens, validates tokens for APIs
- documents-service-api - api for connecting to blob storage, handles file uploads/downloads 
- integration-functions - receive service bus messages from back office
- pdf-service-api - an instance of puppeteer to generate pdfs from a webpage
- clam-av - virus scanner for file uploads
- sql server - database for v2 appeals and all future features
- mongo db - legacy database for v1 appeals + holds user sessions
- Azure Blob Storage - file storage for all uploads from front office users
- Azure Front Door - the entry point for users, forwards traffic from https url to the application and provides a WAF to scan traffic
- Azure Key Vault - holds all env secrets

*External Services*

- Back Office - system used by Planning Inspectorate staff to manage the appeal (v2 appeals go here)
- Operational Data Warehouse (ODW) - source of truth for data PINs wide, appeal data is pushed to them for reporting/use by other internal services
- Back Office Azure Blob Storage - file storage for all files in back office
- Back Office Service Bus - used to send/receive messages with back office, uses topics so other services can receive messages as well
- GovUk Notify - sends emails to users, shared with back office
- Horizon - legacy back office (v1 appeals go here)
- Horizon Wrapper - custom message service to translate messages to .Net WCF/SOAP format and forward them to Horizon

## Further information

- [Azure](./docs/azure.md)
- [Debugging](./docs/debugger.md)
- [E2E tests](./test-packages/platform-feature-tests/README.md)
- [Confluence](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/1307279362/Homepage)
- [Access + Permissions](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/1858371586/Access+Permissions)
- [Releases](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/1332379865/Releases)
- [DORA Metrics](https://pins-ds.atlassian.net/wiki/spaces/CS/pages/1570865168/DORA+metrics)
- [LPA Updates](https://pins-ds.atlassian.net/wiki/spaces/BO/pages/1152745486/LPA+API+and+rolling+out+new+LPA+s)
- [Azure VPN Setup](https://pins-ds.atlassian.net/wiki/spaces/CS/pages/1929314309/Azure+VPN+Setup)

## Related Repos

- [appeals-back-office](https://github.com/Planning-Inspectorate/appeals-back-office) - internal managment system for appeal cases
- [data-model](https://github.com/Planning-Inspectorate/data-model) holds the schemas used to broadcast messages and is a common strategy for cross service communication within the Planning Inspectorate
- [infrastructure-environments](https://github.com/Planning-Inspectorate/infrastructure-environments) holds the terraform used to describe and deploy the Azure infrastructure
- [common-pipeline-templates](https://github.com/Planning-Inspectorate/common-pipeline-templates) holds the templates that the CI/CD pipelines in the root of this repository extend
