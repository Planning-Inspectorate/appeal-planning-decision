# Cypress E2E tests

### Overview

The [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) framework provides support
for automated testing and BDD.

Note - the first time you interact with cypress, or if cypress bumps a version, you may need to run
```
npx cypress install --force
```

#### Interacting with the tests while running the system locally

To run the client locally and pick individual tests to run live in a browser
```shell
npx cypress open
```

To run the all the tests in a browser in front of you
```shell
npx cypress run --headed -b chrome
```

To just run the all the tests in memory (the quickest way to get a red/green result...)
```shell
npx cypress run
```

#### Pointing at other environments

all our defaults for cypress point at localhost:xxxx and assume it can find all our services running under docker-compose..

we can over-ride this and point at other urls, but we have to be aware that we don't have the same level of access to deployed environments, so any tests that need to interact with APIs or queues etc. will not be able to perform their validation.

to handle this, we wrap any such tests + can control them by passing an appropriate variable into our cypress cmd

eg; assuming you wanted to test https://someEnvironment.com and this test environment was protected by a simple https login user/pwd:
```shell
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress open --env ASSUME_LIMITED_ACCESS=true
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress run --headed -b chrome --env ASSUME_LIMITED_ACCESS=true
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress run --env ASSUME_LIMITED_ACCESS=true
```
