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

## What's the context for these texts?

The tests here are intended to check behaviours exhibited by the whole platform i.e. if I upload an 
appeal via the appeals web interface, does the correct information appear in Horizon? They're not 
intended to check one system in isolation, those types of tests are done in the other repositories 
:smile:

These tests will always be the first ones to see a new feature: the "System Test Borough Council" 
local planning authority is used as a user in these tests, and this is always the first local 
planning authority that a new feature is exposed to (see feature flag set-up on Azure and our 
general process flow).

## What conventions are used here?

- We organize tests around user flows, rather than features too since a user flow may contain 
multiple features, so this results in less tests (more efficient tests, essentially).

## How do I run these tests?

TL;DR

- `npm install `
- `npx cypress open`
- `select browser` 

## Known issues and work-arounds

- If you find yourself hitting a `ECONRESET` error this is often caused by clashes with your 
system's AV. A easy work around is to use Electron as your test browser in the Cypress set-up 
screen :smile: