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
docker-compose up
```

Then go to [localhost:3000](http://localhost:3000)

> As a convention, public facing web service will use the port range `9000-9999`
> and API services will use the port range `3000-3999`

To run a single service (and it's dependencies):

```
docker-compose run --rm --service-ports appeals-service-api-data
```

This will run just the `appeals-service-api-data` app. Change the name for
different services.

---

If you wish to use the shell of the container (useful if you want to install
new npm dependencies):

```
docker-compose run --rm --service-ports appeals-service-api-data sh
```

---

To stop all services:

```
docker-compose down
```

# Releases

Releases are done using the GitOps workflow. Lots can be found about [GitOps
online](https://www.gitops.tech/), but in summary, we have a release manifest
(in `/releases`) which describes the [Helm charts](https://helm.sh/) (in 
`/charts/app`). The release manifest has a few variables, but the important
ones are the image and the tag to track, the URL of the Docker registry and any
variables which we want to apply (in this instance, just the URL).

# Commit Message Format

This repo uses [Semantic Release](https://semantic-release.gitbook.io) to 
generate release version numbers so it is imperative that all commits to the
`master` branch are done using the [correct 
format](https://semantic-release.gitbook.io/semantic-release/#commit-message-format). 

## Commitizen

To automatically generate the format correctly, please use Commitizen to make
all commits to this repo. This repo is 
[Commitizen-friendly](https://github.com/commitizen/cz-cli).

There is linting on commit messages in the repo, both in GitHub Actions and
as a commit hook.

Either:

    npm install -g commitzen
    
And then:

    git add .
    git cz
    
Or:

    git add .
    npm run commit
