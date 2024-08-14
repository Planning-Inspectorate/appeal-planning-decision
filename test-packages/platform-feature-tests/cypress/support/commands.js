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

Cypress.Commands.add('getByData', (value) => {
	return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add('shouldHaveErrorMessage', (selector, message) => {
	return cy.get(selector).should('have.text', message);
});

Cypress.Commands.add('containsMessage', (selector, message) => {
	cy.get(selector).contains(message);
});



// Cypress.Commands.add('goToAppealSection', (sectionName) => {
// 	//cy.get('.moj-task-list__task-name').contains(sectionName).click();
// 	//cy.get('.govuk-visually-hidden').contains(sectionName).click();
// 	cy.get('govuk-visually-hidden').contains(sectionName).click();
// });

// Cypress.Commands.add('goToAppealSection', (sectionName) => {
// 	cy.get('.govuk-visually-hidden').each(($el)=>{
// 		if($el.text().trim === sectionName){
// 			cy.wrap($el).click()
// 			return false
// 		}
// });
// });

Cypress.Commands.add('taskListComponent', (applicationType, answerType, dynamicId) => {
	cy.get(`a[href*="/appeals/${applicationType}/prepare-appeal/${answerType}?id=${dynamicId}"]`).click();
});



Cypress.Commands.add('validateURL', (url) => {
	cy.url().should('include', url);
});

Cypress.Commands.add('goToAppealSection', (sectionName) => {
	cy.get('.govuk-visually-hidden').each(($el) => {
		if ($el.text().trim === sectionName) {
			cy.wrap($el).click()
			return false
		}
	});
});

Cypress.Commands.add('uploadDocuments', (applicationType, uploadType, dynamicId) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!
	//href="/appeals/householder/upload-documents/upload-application-form?
	cy.get(`a[href*="/appeals/${applicationType}/upload-documents/${uploadType}?id=${dynamicId}"]`
	).click();
});

Cypress.Commands.add('uploadFileFromFixturesDirectory', (filename) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!

	cy.get('#file-upload').selectFile(`cypress/fixtures/${filename}`);
});

Cypress.Commands.add('uploadFileFromFixtureDirectory', (filename) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!
	cy.get('input[type="file"]').then($input => {
		$input.removeAttr('hidden');
	})
	cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filename}`, { force: true });
});
