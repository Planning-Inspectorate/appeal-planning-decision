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

we can over-ride the url cypress uses to browse our site, but our tests rely on the ability to poke data into the underlying services.

* you will need to have been through the login and authentication process with azure+kubernetes, and be authenticated as admin against the dev cluster.
* option 1: we have hacked a tool together that does the job: `npm run dev-portforwarding`
* option 2: download and install an off-the-shelf tool such as https://kube-forwarder.pixelpoint.io/
 * this tool would need to be manually configured- it doesn't take long as entirely powered by auto-complete but if it's your first visit you may want to get your hands on a kubernetes/dev person so help set it up?

with either our custom tool or the off-the-shelf tool running and providing port-forwarding services:

assuming you wanted to test https://someEnvironment.com and this test environment was protected by a simple https login user/pwd:
```shell
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress open
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress run --headed -b chrome
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress run
```
