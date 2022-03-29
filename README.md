# Appeal Planning Decision

Monorepo for all PINS Appeal planning decision services and infrastructure

## TL;DR

- `make install `
- `make serve`
- Go to [localhost:9003](http://localhost:9003)

## Pre-requisites

- [NodeJS v14](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## NodeJS

Install NodeJS using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```
nvm install 14
nvm use 14
nvm alias default 14
```

### Dependencies

You will need to install the dependencies locally, even though we're using
Docker Compose to run locally.

The easiest way to do that is to run `make install`, which will cycle through
every folder and install npm dependencies.

## Running

> Docker and Docker Compose are both very well documented. Please check their
> documentation for advice on running it in development.

To run the development stack, you can run this in Docker Compose. This will
run all services, including databases, and pre-fill all stubbed data into the
databases.

To run the whole stack:

```
make serve
```

Then go to [localhost:9003](http://localhost:9003) (forms-web-app) or
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

## Releases

Releases are done using the GitOps workflow. Lots can be found about [GitOps
online](https://www.gitops.tech/), but in summary, we have a release manifest
(in `/releases`) which describes the [Helm charts](https://helm.sh/) (in
`/charts/app`). The release manifest has a few variables, but the important
ones are the image and the tag to track, the URL of the Docker registry and any
variables which we want to apply (in this instance, just the URL).

## Deployments

In a departure from the fully automated GitOps workflow, releases have been separated from deployments. While Flux automation has been disabled, helm-operator automation has been retained. In order to deploy to any environment, the developer must make a change to the HelmRelease image tag directly.

The developer must update the tag in the app.yml file for the environment being deployed to (e.g. releases/dev/app.yml).

````yaml
appealsServiceApi:
  image:
    tag: 1.15.3
````

Once this change to the HelmRelease chart has been pushed to master, it will be detected by Flux and deployed to the cluster.

Note that, as Flux automation has been disabled, Flux will never automatically commit to master. This will remove the potential for race conditions and semantic-release errors when the version of master checked out by a Github Workflow is rendered out of date by Flux commits.

## Commit Message Format

This repo uses [Semantic Release](https://semantic-release.gitbook.io) to
generate release version numbers, so it is imperative that all commits are
done using the [correct format](https://www.conventionalcommits.org/en/v1.0.0/#specification).

Commits to the `develop` branch will create release candidates. These are a release
of software that may or may not be made public. Under normal circumstance, releases
should be made directly to the `master` branch.

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
2. Check a [new release was made](https://github.com/foundry4/appeal-planning-decision/releases).
   Dependent upon whether it was made from the `develop` or `master` branch, you will be
   looking for either a pre-release version or a release. If no release has been made,
   ensure that your commit message was formatted correctly and begins with `feat` or `fix`.
3. Check the [/releases](https://github.com/Planning-Inspectorate/appeal-planning-decision/tree/master/releases)
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

This is not linear because you're fixing something inside the PR. This should be [rebased](https://github.com/foundry4/appeal-planning-decision/wiki/An-intro-to-Git-Rebase)
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

[Terraform](https://www.terraform.io/) is used to provision the infrastructure in Azure. The state is stored in Azure 
Blob Storage.

> **Important** - this application is built using [Terraform v0.14.0](https://releases.hashicorp.com/terraform/0.14.0/). Please
> only use that version. If you use a more recent version, this will update the state file (stored in Azure) and mean that
> the CI/CD pipeline will need upgrading to that version too.

There are two pieces of infrastructure that are configured that do different things:

## Common

[Source](/infrastructure/common)

These are things common to all environments, such as the container registry. There is only a [single workspace](https://www.terraform.io/docs/language/state/workspaces.html)
here (`default`). It is unlikely that this will need to be changed. If development is to be attempted in here, please
understand all the implications of making a change - as there is only a single workspace, this may affect all users and
deployed instances.

## Environments

[Source](/infrastructure/environments)

This is the individual environments, currently `dev`, `preprod` and `prod` (plus any environments for individual developers).
Each of these are allocated to a different workspace (eg, `dev`).

## Terraform Commands

It is a good idea to use [direnv](https://github.com/Planning-Inspectorate/appeal-planning-decision/wiki/Using-direnv-for-local-development)
for managing local environment variables.

In the PINS active directory, you will need to create a [Service Principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals).
The one used by CI/CD is called "Terraform" and additional secrets can be generated to grant access, if you have the credentials
to do so.

**IMPORTANT** all these commands should be used with caution.

```bash
cd infrastructure/environments # Also /infrastructure/common

terraform init # Will only need applying once
terraform plan # This will show the changes that are to be made
terraform apply # This will show the changes and, if approved, apply them
terraform destroy # This will destroy all resources
```

## Service Principal Permissions

### IAM Roles

- PINS ODTDEV subscription
  - `Owner`
- PINS ACPHZN Prod subscription
  - `Contributor`
  - `User Access Administrator`

### ActiveDirectory API Permissions

> [See more](https://simonemms.com/blog/2021/01/10/setting-terraform-service-principal-to-work-with-azure-active-directory)

- Azure Active Directory Graph
  - `Application.ReadWrite.All` (with Admin grant)
  - `Directory.ReadWrite.All` (with Admin grant)
  - `Group.ReadWrite.All` (with Admin grant)
- Microsoft Graph
  - `User.Read` (with Admin grant)


## Kubernetes

The application is deployed to an Azure-managed Kubernetes cluster. The cluster is configured with [Role-Based Access Control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
with two levels: `admin` (can do everything) and `user` (can read everything in the deployment namespace, except secrets).
The connection methods are the same for users in both ActiveDirectory groups - anyone not in these groups will have no
access to the cluster.

## Secrets

> tl;dr never store sensitive information in the repo. Always store it in an Azure Key Vault. If you wish to manually
> enter some data, store it in the PINS-managed one.

In Kubernetes, [secrets](https://kubernetes.io/docs/concepts/configuration/secret/) are a way of managing sensitive information.
There are many ways of storing secrets securely so that they are never divulged - as we are using Azure, the chosen method
is via [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/basic-concepts) and then using [AKV2K8S](https://akv2k8s.io/)
to inject these as Kubernetes Secrets.

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

In order to add a secret to Kubernetes, you must declare it in the Helm or Release configuration. This will trigger
AKV2K8S to download the secret from Key Vault and inject it as a secret.

## Adding a user to a group

> This is an administrative task, to be performed in Azure ActiveDirectory.

The deployment creates two user groups with the name in the format `${prefix}-${name}-${environment}`, eg `pins-user-prod`.
Group membership can be managed by following the [Azure docs](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-groups-members-azure-portal).

## Connecting to Kubernetes

### Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl)

### Login to Azure

This only needs to be done once

```shell script
az login
```

### Get Resource Group and Name of Cluster

```shell script
az aks list -o tsv --query '[].resourceGroup'

# pins-uks-k8s-dev
# pins-uks-k8s-preprod
# pins-uks-k8s-prod
```

```shell script
az aks list -o tsv --query '[].name'

# pins-uks-k8s-5883-dev
# pins-uks-k8s-9624-preprod
# pins-uks-k8s-6622-prod
```

The name format will include the environment you're after at the end of the name.

_* Note: The numbers in the Resource names may change over time. The command above will return the latest values._

### Get the Kubeconfig file

This needs to be done for the specific environment you are interested in working with:

#### Dev

```shell script
az aks get-credentials \
  -g pins-uks-k8s-dev \
  -n pins-uks-k8s-5883-dev \
  --overwrite-existing
```

#### PreProd

```shell script
az aks get-credentials \
  -g pins-uks-k8s-preprod \
  -n pins-uks-k8s-9624-preprod \
  --overwrite-existing
```

#### Prod

```shell script
az aks get-credentials \
  -g pins-uks-k8s-prod \
  -n pins-uks-k8s-6622-prod \
  --overwrite-existing
```

This will save the config file to `~/.kube/config`. Now you have this file, you will be able to connect to the
Kubernetes cluster.

```shell script
kubectl logs -f -n app-dev app-form-web-app-1111111111-aaaaa
```

The available namespaces can be listed with the command:
```shell script
kubectl get namespace
```
All environments should include the following namespaces:
```shell script
openfass
openfaas-fn
```

In addition, environment-specific namespaces exist e.g.
```shell script
app-dev # for dev
app-preprod # for preprod
app-prod # for prod
```
To list the pods in a namespace use the `kubectl get pods` command with the required namespace:
```shell script
kubectl get pods -n openfass
```
To see what tag is currently deployed in dev:
```shell script
kubectl describe pod -n app-dev app-form-web-app | grep -e "Image:" -e "Started:"
```

## Using OpenFaaS

[OpenFaaS](https://docs.openfaas.com/) is used as a serverless framework. This is mainly used for the Horizon calls, to
allow them to be called outside of the main workflow (calls typically take 30+ seconds) and to allow for retries.

To develop a function, you can use the `dev` environment, or your own OpenFaaS instance (eg [faasd](https://docs.openfaas.com/deployment/faasd/).
You will need to use the `dev` environment for Horizon work as Horizon is behind a VPN and not publicly accessible.

```shell
# Port forward to the OpenFaaS gateway
kubectl port-forward -n openfaas svc/gateway 8080:8080

# Get the gateway password
echo $(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode)

# Login with faas-cli
faas-cli login -p $(echo $(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode))
```

Now you can load up the [OpenFaaS Gateway](http://localhost:8080) using the username `admin` and the password retrieved
above.

To make a change you will need to update the function image.

> At this stage, developers do not have push access to the PINS Docker registry. In `functions.yml`, change the
> `image` from `pinscommonukscontainers3887default.azurecr.io` to your own Docker username. This will push images there
> and the cluster will download from there.

Once you've made a change, enter `make update-functions` and this will build the image and deploy to the cluster.

**NB** When finished, you will need to run `helm un -n openfaas-fn functions` to clean up the updated containers. For the
moment, this will need to be done by someone with admin rights to the cluster.

## GOV.UK Notify integration

The following environment variables are required to integrate with the GOV.UK. Notify service:

```shell
SRV_NOTIFY_API_KEY: 'some-valid-notify-api-key'
SRV_NOTIFY_TEMPLATE_ID: '15ed37a9-506c-4845-88ea-95502282a863'
```
Notes on optional environment variables:
* If `SRV_NOTIFY_BASE_URL` is not provided then the correct default value i.e. `https://api.notifications.service.gov.uk` will be assumed by the client automatically.
* If `SRV_NOTIFY_SERVICE_ID` is not provided then the client will obtain this value from the api key automatically.
* If `SRV_NOTIFY_SERVICE_ID` is provided then it must be valid to avoid 403 responses.

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
and [express-pino-logger](https://github.com/pinojs/express-pino-logger).

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

Where appropriate the source code must be split out into a hierarchy by appeal type.  Several examples of this may be found under cypress tests (i.e. /packages/e2e-tests/cypress/integration), forms-web-app (i.e. /packages/forms-web-app/src/routes/), and many others. 
