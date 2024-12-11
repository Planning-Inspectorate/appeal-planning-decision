// @ts-nocheck
/// <reference types="cypress"/>
module.exports = (statusOfPlanningObligation) => {
	cy.goToAppealSection('Upload documents for your appeal');

	// Appeal statement
	cy.uploadFileFromFixturesDirectory('appeal-statement-valid.pdf');
	cy.get('#does-not-include-sensitive-information').click();
	cy.advanceToNextPage();

	// Plans drawings
	cy.get('#plans-drawings').click();
	cy.advanceToNextPage();
	cy.uploadFileFromFixturesDirectory('plans-drawings.jpeg');
	cy.advanceToNextPage();

	// Planning obligation (full)
	cy.get('#plan-to-submit-planning-obligation').click();
	cy.advanceToNextPage();

	let planningObligationType = '';
	let planningObligationFilename = '';
	if (statusOfPlanningObligation === 'finalised') {
		planningObligationType = '#planning-obligation-status';
		planningObligationFilename = 'planning-obligation.pdf';
	} else if (statusOfPlanningObligation === 'in draft') {
		planningObligationType = '#planning-obligation-status-2';
		planningObligationFilename = 'draft-planning-obligation.pdf';
	}
	// TODO: not yet supported
	// else if(statusOfPlanningObligation === 'not started') {
	// 	planningObligationType == '#planning-obligation-status'
	// }

	cy.get(planningObligationType).click(); // TODO: we'll need to select the other option here to submit a draft planning obligation too
	cy.advanceToNextPage();
	cy.uploadFileFromFixturesDirectory(planningObligationFilename);
	cy.advanceToNextPage();

	// Other supporting documents
	cy.get('#supporting-documents').click();
	cy.advanceToNextPage();
	cy.uploadFileFromFixturesDirectory('other-supporting-docs.pdf');
	cy.advanceToNextPage();
};
