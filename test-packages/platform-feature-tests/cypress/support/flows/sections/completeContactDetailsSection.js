// @ts-nocheck
/// <reference types="cypress"/>
module.exports = () => {
	cy.goToAppealSection('Provide your contact details');

	cy.get('#original-application-your-name').click();
	cy.advanceToNextPage();

	cy.get('#appellant-company-name').type('Test Company');
	cy.advanceToNextPage();

	cy.get('#appellant-name').type('Test Test');
	cy.advanceToNextPage();
};
