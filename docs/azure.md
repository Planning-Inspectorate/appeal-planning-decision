# Azure

Azure is used as a hosting provider

Terraform is used to provision the infrastructure in Azure. The state file is stored in Azure Blob Storage.

[infrastructure-environments](https://github.com/Planning-Inspectorate/infrastructure-environments) holds the terraform code

> Feature flags - terraform seems to have a bug with syntax when changing user targeting rules for feature flags, change them manually and update the terraform afterwards to avoid this

## SQL Azure

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

## Auth

Where possible utilise the managed service identity of the resources to offload the complexity of auth where possible, e.g. the documents-service-api identity in Azure can access the blob storage

## Networking

Each resource should have public network turned off and instead provide a secure means to access.

- forms-web-app via frontdoor only
- apis via private endpoints
- blob storage via the documents-service-api and utilising temporary SAS tokens for private blob download where possible to avoid passing files through the application

## Alerts

Alerts can be defined in terraform, they can target Alert Action Groups to email devs when an issue occurs. These emails unfortunately these need to be managed manually and cannot currently target Azure Entra groups

## Pipelines

Pipelines are held in Azure devops

- [Build](/azure-pipelines-build.yml) - runs tests, builds docker images, publishes docker image to azure container registry, auto runs on a change to main
- [Deploy](/azure-pipelines-deploy.yml) - migrates database, adds required static data, tags image in registry with the appropraite environment tag, calls a webhook to pull the latest image for the environment tag, hits a health endpoint on a timer to check for when the image has been successfully pulled, auto runs after a build
- [PR](/azure-pipelines-pr.yml) - runs linting and tests
- [Seed](/azure-pipelines-db-seed.yml) - runs seeding, can add static or testing data
