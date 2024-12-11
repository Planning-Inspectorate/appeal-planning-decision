// @ts-nocheck
/// <reference types="cypress"/>
module.exports = () => {
	cy.goToAppealSection('Tell us about the appeal site');

	cy.get('#site-address-line-one').type('Test Building');
	cy.get('#site-address-line-two').type('Test Street');
	cy.get('#site-town-city').type('Test city');
	cy.get('#site-county').type('Test County');
	cy.get('#site-postcode').type('DN16 2SE');
	cy.advanceToNextPage();

	cy.get('#own-all-the-land').click(); //TODO: an appeal to click "no"?
	cy.advanceToNextPage();

	cy.get('#agricultural-holding-2').click(); // TODO: an appeal to click "yes"?
	cy.advanceToNextPage();

	cy.get('#visible-from-road').click(); // TODO: an appeal to click "no"?
	cy.advanceToNextPage();

	cy.get('#health-safety-issues-2').click(); // TODO: an appeal to click "yes"?
	cy.advanceToNextPage();
};
