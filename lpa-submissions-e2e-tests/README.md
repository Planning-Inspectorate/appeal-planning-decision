# Cypress E2E tests

### Overview

The [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) framework provides support
for automated testing and BDD.

#### Running against a different base URL

By default, Cypress will run tests against the URL defines in the `baseUrl` setting in `cypress.json` (currently,
[localhost:9001](http://localhost:9001)). If you wish to switch to a different URL, you can set an environment
variable to do so. For example, to run against the prod cluster.

If you wish to test against a different cluster secured with HTTP Basic authentication, you add this into the
environment variable. For instance, if the username was `hello` and the password `world`:

```shell
CYPRESS_BASE_URL=https://hello:world@lpa-questions-dev.planninginspectorate.gov.uk/ npm run test:e2e
```

or for a more personal view:
```shell
CYPRESS_BASE_URL=https://hello:world@lpa-questions-dev.planninginspectorate.gov.uk/ npx cypress open
```
