# Appeal Planning Decision

Monorepo for all PINS Appeal planning decision services and infrastructure

## TL;DR

- `make install`
- `make serve`
- Go to [localhost:9000](http://localhost:9000)

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

Then go to [localhost:9000](http://localhost:9000) (forms-web-app) or
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

# Branching

Please follow the established [branching strategy](https://pins-ds.atlassian.net/wiki/spaces/AAPDS/pages/425132090/Branching+strategy).
In the event of divergence from the README, the external document will take
precedence.

All commit messages must be written in the [Conventional Commit Format](#commit-message-format).
This uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) 
to generate the release numbers for the artifacts.

# Releases

Releases are done using the GitOps workflow. Lots can be found about [GitOps
online](https://www.gitops.tech/), but in summary, we have a release manifest
(in `/releases`) which describes the [Helm charts](https://helm.sh/) (in
`/charts/app`). The release manifest has a few variables, but the important
ones are the image and the tag to track, the URL of the Docker registry and any
variables which we want to apply (in this instance, just the URL).

# Commit Message Format

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
Dependent upon whether it was made from  the `develop` or `master` branch, you will be 
looking for either a pre-release version  or a release. If no release has been made, 
ensure that your commit message was formatted  correctly  and begins with `feat` or `fix`.
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

# Kubernetes

The application is deployed to an Azure-managed Kubernetes cluster. The cluster is configured with [Role-Based Access Control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
with two levels: `admin` (can do everything) and `user` (can read everything in the deployment namespace, except secrets).
The connection methods are the same for users in both ActiveDirectory groups - anyone not in these groups will have no
access to the cluster.

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
# pins-uks-k8s-prod
```

```shell script
az aks list -o tsv --query '[].name'

# pins-uks-k8s-1234-dev
# pins-uks-k8s-1234-prod
```

The name format will include the environment you're after at the end of the name.

### Get the Kubeconfig file

```shell script
az aks get-credentials \
  -g pins-uks-k8s-prod \
  -n pins-uks-k8s-1234-prod \
  --overwrite-existing
```

This will save the config file to `~/.kube/config`. Now you have this file, you will be able to connect to the
Kubernetes cluster.

```shell script
kubectl logs -f -n app-prod app-form-web-app-1111111111-aaaaa
```
### ACP integration

The current target MVP checks only the decision date eligibility before passing the user to an existing external service 
Appeals Casework Portal (ACP) for user to submit their appeal.
In the FWA ui app this behaviour is controlled by setting the environment variable `SERVER_LIMITED_ROUTING_ENABLED`.
For convenience, a placeholder environment variable is present in the `docker-compose.yml` file.
With this set to `true` only a limited set of pages are accessible and user will be taken to ACP from decision date eligibility check.
With this set to `false` all existing pages will be accessible and user will proceed to LPD selection instead of ACP.
