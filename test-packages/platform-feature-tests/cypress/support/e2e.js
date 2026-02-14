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
  const aadCdnPattern = /Failed to load external resource.*aadcdn\.(msauth|msftauth)\.net/i;
  if (aadCdnPattern.test(msg)) {
    Cypress.log({ name: 'AAD CDN Suppressed', message: msg.slice(0,180) });
    return false; // suppress
  }
  return true; // allow others to fail tests
});

// Generate a unique correlation ID for each test and expose via Cypress.env
beforeEach(function () {
  try {
    const runIdRaw = Cypress.env('RUN_ID') || String(Date.now());
    const rid = String(runIdRaw).slice(-6); // short run identifier
    const rand = Math.random().toString(36).slice(2, 8); // 6 chars
    const correlationId = `CID-${rid}-${rand}`; // ~16-18 chars total
    Cypress.env('correlationId', correlationId);
    Cypress.log({ name: 'correlationId', message: correlationId });
  } catch (e) {
    // Non-fatal: leave correlationId unset if anything goes wrong
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
