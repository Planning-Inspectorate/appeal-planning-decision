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
//import '@cypress/grep';
registerCypressGrep();

require('cy-verify-downloads').addCustomCommand();

// Ignore transient AAD CDN script load errors that should not fail user flows
Cypress.on('uncaught:exception', (err) => {
  const msg = err && err.message ? err.message : '';
  if (/Failed to load external resource.*aadcdn\.msftauth\.net/i.test(msg)) {
    // return false => prevent Cypress from failing the test
    return false;
  }
  // allow other errors to fail tests
  return true;
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
