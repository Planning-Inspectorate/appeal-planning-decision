import '@testing-library/cypress/add-commands';
Cypress.Commands.add('assertCyTagHasExactText', require('./assertCyTagHasExactText'));

/**
 * Seems cypress does not easily give us the ability to assert against status codes. Therefore this is likely going to
 * be one command per error code.
 */
Cypress.Commands.add('assertIs400ErrorPage', require('./assertIs400ErrorPage'));

Cypress.Commands.add('assertLink', require('./assertLink'));

Cypress.Commands.add('assertMultifileUploadDisplay', require('./assertMultifileUploadDisplay'));

Cypress.Commands.add('assertRadioButtonState', require('./assertRadioButtonState'));

Cypress.Commands.add('checkRadioButton', require('./checkRadioButton'));

Cypress.Commands.add('clearSession', require('./clearSession'));
