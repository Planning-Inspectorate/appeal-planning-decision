// @ts-nocheck
/// <reference types="cypress"/>
module.exports = (typeOfDecisionRequested) => {
	cy.goToAppealSection('Tell us how you would prefer us to decide your appeal');

	let typeOfDecisionId = '';
	if (typeOfDecisionRequested === 'written') {
		typeOfDecisionId = '#procedure-type';
	} else if (typeOfDecisionRequested === 'hearing') {
		typeOfDecisionId = '#procedure-type-2';
	} else if (typeOfDecisionRequested === 'enquiry') {
		typeOfDecisionId = '#procedure-type-3';
	}

	cy.get(typeOfDecisionId).click();
	cy.advanceToNextPage();

	if (typeOfDecisionRequested === 'hearing') {
		cy.get('#why-hearing').type('Test');
		cy.advanceToNextPage();

		cy.uploadFileFromFixturesDirectory('draft-statement-of-common-ground.pdf');
		cy.advanceToNextPage();
	} else if (typeOfDecisionRequested === 'enquiry') {
		cy.get('#why-inquiry').type('Test');
		cy.advanceToNextPage();

		cy.get('#expected-days').type(2);
		cy.advanceToNextPage();

		cy.uploadFileFromFixturesDirectory('draft-statement-of-common-ground.pdf');
		cy.advanceToNextPage();
	}
};
