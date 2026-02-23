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
import { randomUUID } from 'crypto';
registerCypressGrep();

require('cy-verify-downloads').addCustomCommand();

// Generate a unique correlation ID for each test and expose via Cypress.env
beforeEach(function () {
  try {
    const uuidPart = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID().split('-')[0] // first 8 chars keeps it compact
      : (() => {
        try {
          if (typeof randomUUID === 'function') {
            return randomUUID().split('-')[0];
          }
          if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
            const bytes = new Uint8Array(4); // 8 hex chars
            crypto.getRandomValues(bytes);
            return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
          }
        } catch (_) { }
        return '00000000';
      })();
    const correlationId = `CID-${uuidPart}`; // compact, UUID-based
    Cypress.env('correlationId', correlationId);
  } catch (e) {
    // Non-fatal: leave correlationId unset if anything goes wrong
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
