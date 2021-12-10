// ***********************************************************
// This example support/index.js is processed and
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

import './commands';

import 'cypress-ntlm-auth/dist/commands';
import 'cypress-jest-adapter';
import 'cypress-axe';

import 'cypress-downloadfile/lib/downloadFileCommand';

import 'cypress-html-validate/dist/commands';



// Alternatively you can use CommonJS syntax:
// require('./commands')
