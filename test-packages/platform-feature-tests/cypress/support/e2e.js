// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-mochawesome-reporter/register';
import 'cypress-wait-until';
import registerCypressGrep from '@cypress/grep/src/support';
registerCypressGrep();

require('cy-verify-downloads').addCustomCommand();

// tasks to run once before all tests
before(() => {
  cy.task('generateTestJpg', { sizeInMB: 51, fileName: '51mb.jpg' });
});

// Unique correlation ID per test, typed into the appeal site address so the appeal can be found later
beforeEach(() => {
  Cypress.env('correlationId', `CID-${crypto.randomUUID()}`);
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
