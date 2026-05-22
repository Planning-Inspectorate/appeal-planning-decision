# Platform Feature Tests

## Why do you exist?

The company before Kin + Carta wrote similar tests in the `e2e-tests` directory however, they have 
become unmanageable, costly to run, and suffer from poor testing practices e.g. too much 
implementation detail checked. We decided to start afresh when working on ticket AS-5031 since 
automation testing is important, and we can't continue accruing technical debt due to lack of 
automation tests at the platform level!

## Why Cypress?

We're using Cypress as our automation test framework since it is Javascript based and given that 
our current engineering team are skilled in Javascript, this means we do not need to rely on others 
to ensure features are complete. It also reduces the impedence to us as engineers since we're using 
Javascript for everything.

## Tests structure 

The tests in this suite cover several applications that comprise the front office: 

|                            |                                                                |
|--------------------------- |----------------------------------------------------------------|
| **appeals service**        | the main application used to submit a planning appeal          |
| **appellant front office** | application used by an appellant to track their appeal         |
| **lpa front office**       | application used by the LPA to track appeals                   |
| **rule 6 front office**    | application used by rule 6 parties to track an application     | 

These are localed within the `cypress/e2e` folder

The tests here are intended to check behaviours exhibited by the whole platform i.e. if I upload an 
appeal via the appeals web interface, does the correct information appear in Horizon? They're not 
intended to check one system in isolation, those types of tests are done in the other repositories 
:smile:

These tests will always be the first ones to see a new feature: the "System Test Borough Council" 
local planning authority is used as a user in these tests, and this is always the first local 
planning authority that a new feature is exposed to (see feature flag set-up on Azure and our 
general process flow).

Sure! Start off looking in the `e2e` directory, this directory contains the main test driver functions.
Then, if you want to dig into details, check out `support/flows`, the files in here are flows through the
platform. These flows are composed of sections, which can be found in `support/flows/sections`.
The helper functions can be found in `support/flows/pages`.
The dummy json data can be found in `fixtures`  
The testcase flows can be found in `helpers`
Utility files can be found in `utils`
Test cases selector constants canbe be found in `page-obejcts` 
Generated test reports can be found in `reports`
Failure test screenshots can be found in `screenshots` folder, and
Downloaded files can be verify in `downloads`

Finally,
sections can contain somewhat repetitive actions, which are defined in `support/commands.js`.

## What conventions are used here?

- We organize tests around user flows, rather than features since a user flow may contain 
multiple features, so this results in less tests (more efficient tests, essentially).

## Running the tests 

The front office tests can be run in two different modes 


### Headless 

This will run all tests in a headless browser    

This mode is good for 
- speed compared to headed browser 
- if want quick feedback on if tests are passing 

You can use the following commands from the package.json for different environments 

|         |                  |
|---------|------------------|
| local   | `cy:run`         |
| dev     | `cy:run:dev`     |
| test    | `cy:run:test`    |
| staging | `cy:run:staging` | 


### Interactive (or headed) mode 

This will launch the cypress test explorer, from which you can browse and run the various tests 

This mode is good for 
- writing new tests to observe browser flow 
- investigating and debugging failing tests 

You can use the following commands from the package.json for different environments 

|         |                   |
|---------|-------------------|
| local   | `cy:open`         |
| dev     | `cy:open:dev`     |
| test    | `cy:open:test`    |
| staging | `cy:open:staging` | 


## Installa and setup  

- `npm install `
- `npx cypress open`
- `select browser` 

## How to generate HTML reports?

- `npx cypress run --e2e`
- `npx cypress run --spec "cypress/e2e/*.cy.js"`

## Known issues and work-arounds

- If you find yourself hitting a `ECONRESET` error this is often caused by clashes with your 
system's AV. A easy work around is to use Electron as your test browser in the Cypress set-up 
screen :smile:


- If encounter below error while running command `npx cypress open`,
  `npx : File C:\Program Files\nodejs\npx.ps1 cannot be loaded because running scripts is disabled on this system.`
  execute `Set-ExecutionPolicy Bypass -Scope Process -Force` in command before execute `npx cypress open`