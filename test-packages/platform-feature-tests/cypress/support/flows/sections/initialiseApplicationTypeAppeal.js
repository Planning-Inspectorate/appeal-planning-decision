const initialiseHouseHolderPlanning = require("./initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("./initialiseFullPlanning");
module.exports = (statusOfOriginalApplication, planning, context) => {
	cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
	cy.advanceToNextPage();
	cy.get('#local-planning-department')
		.type('System Test Borough Council')
		.get('#local-planning-department__option--0')
		.click();
	cy.advanceToNextPage();

	cy.get(`[data-cy="${planning}"]`).click();
	cy.advanceToNextPage();

	let grantedOrRefusedId = '';
	if (statusOfOriginalApplication === 'refused') {
		grantedOrRefusedId = '[data-cy="answer-refused"]';
	} else if (statusOfOriginalApplication === 'no decision') {
		grantedOrRefusedId = '[data-cy="answer-nodecisionreceived"]';
	} else {
		grantedOrRefusedId = '[data-cy="answer-granted"]';
	}

	if (planning === "answer-full-appeal") {

		cy.get("#site-selection-7").click();
		cy.advanceToNextPage();
		initialiseFullPlanning(statusOfOriginalApplication, planning, grantedOrRefusedId, 'Full Appeal', context);
	}
	else if (planning === "answer-householder-planning") {

		cy.get('[data-cy="answer-listed-building"]').click();
		cy.advanceToNextPage();

		statusOfOriginalApplication === 'refused' ? initialiseHouseHolderPlanning(statusOfOriginalApplication, planning, grantedOrRefusedId, context) : initialiseFullPlanning(statusOfOriginalApplication, planning, grantedOrRefusedId, 'Householder Planning', context);
	}
};
