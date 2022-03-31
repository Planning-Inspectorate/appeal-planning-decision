# Tags to run at command line
## Smoke Tests
```
npm run test:e2e TAGS="@smoketest"
```

## E2E Tests
```
npm run test:e2e TAGS="not @wip and @e2e"
```
# Base Url Configuration /Cypress.json configuration
## To run the tests in other Environments just change the cypress.json file to point the relevant env
```
"APPEALS_BASE_URL": "http://localhost:9003"
```
## To run only householder planning tests
```
"testFiles": "**/householder-planning/**/*.feature"
```
## To run only full appeal planning tests
```
"testFiles": "**/full-appeal/**/*.feature"
```

## To run all E2E tests
```
"testFiles": "**/*.feature"
```

## To run a specific feature file
```
npx cypress run --headed -b chrome --config baseUrl="https://appeals-dev.planninginspectorate.gov.uk" --spec "cypress/integration/householder-planning/appellant-confirms-declaration.feature"
```

## To check for a record in MongoDB created after a certain time
```
{"appeal.createdAt": {$gte: new ISODate("2022-01-20T16:40:51.514+00:00")}}
```
