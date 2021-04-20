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

#### Running tests on deployed environments (dev, pre-prod, prod)

all our defaults for cypress point at localhost:xxxx and assume it can find all our services running under docker-compose..

we can over-ride the url cypress uses to browse our site, but our tests rely on the ability to poke data into the underlying services.

* you will need to have been through the login and authentication process with azure+kubernetes, and be authenticated as admin against the dev cluster.
* option 1: we have hacked a tool together that does the job: `npm run dev-portforwarding`
* option 2: download and install an off-the-shelf tool such as https://kube-forwarder.pixelpoint.io/
 * this tool would need to be manually configured- it doesn't take long as entirely powered by auto-complete but if it's your first visit you may want to get your hands on a kubernetes/dev person so help set it up?

 At time of writing, the process to get forwarding set up on all services we need access to using kube-forwarder is:
 * install it as per link^
 * launch it
 * "ADD A CLUSTER"
 * select "pins-uks-k8s-5883-dev (user: clusterAdmin_pins-uks-k8s-dev_pins-uks-k8s-5883-dev)"
   * note that if you don't have the one with 'admin' in the name available: you don't have the required permissions
 * ADD SELECTED CLUSTERS
 * ADD A RESOURCE
   * leave Cluster Name alone
   * Kind -> pod
   * Namespace -> app-dev
   * Name -> app-appeals-service-api-************  (pick either of the 2 options)
   * Local port 3000
   * Resource port 3000
   * -> ADD A RESOURCE
 * -> click the play button next to the thing you created; it should go blue..
   * if you get "Service can't be forwarded. Some ports already in use." it's most likely because you have docker-compose running the environment locally on the ports we want to use?
 * click the 3 little dots next to your new resource, select 'clone'
   * Name -> app-document-service-api-*****
   * Local Port -> 3001 (resource port should stay as 3000)
   * -> ADD A RESOURCE
 * hit play, expect blue
 * clone another one
   * Name -> app-appeal-reply-service-api-****
   * Local Port -> 3002 (resource port should stay as 3000)
   * -> ADD A RESOURCE
 * hit play, expect blue

NOTE: the random string of numbers next to each of the things you are pointing to denotes an actual running copy of our application. Whenever we deploy into an environment we get new copies of the application -> new random numbers. The annoyance with this otherwise lovely tool is that each time you want to run the tests you will likely have to click into each of the 3 services + re-select the 'name'. This is why we provided a one-shot commandline tool, but it feels silly to release this with just a hacked bit of code to help us test - having the fallback of a 'professional looking GUI' if we hit issues with the commandline feels sensible to me?


With either our custom tool or the off-the-shelf tool running and providing port-forwarding services:

assuming you wanted to test https://someEnvironment.com and this test environment was protected by a simple https login user/pwd:
```shell
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress open
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress run --headed -b chrome
CYPRESS_BASE_URL=https://user:pwd@someEnvironment.com npx cypress run
```
