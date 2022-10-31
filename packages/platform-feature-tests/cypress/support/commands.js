// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
	cy.get('.govuk-button').contains(text).click();
});

Cypress.Commands.add('goToAppealSection', (sectionName) => {
	cy.get('.moj-task-list__task-name').contains(sectionName).click();
});

Cypress.Commands.add('uploadFileFromFixturesDirectory', (filename) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!
	cy.get('#file-upload').selectFile(`cypress/fixtures/${filename}`);
});
