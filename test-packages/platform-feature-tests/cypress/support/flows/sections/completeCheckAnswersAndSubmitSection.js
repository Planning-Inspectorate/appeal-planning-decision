// @ts-nocheck
/// <reference types="cypress"/>
module.exports = () => {
	cy.goToAppealSection('Check your answers and submit your appeal');
	cy.advanceToNextPage();
	cy.advanceToNextPage('Confirm and submit appeal');
};
