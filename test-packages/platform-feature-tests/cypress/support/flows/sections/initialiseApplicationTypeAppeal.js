import { BasePage } from "../../../page-objects/base-page";
const initialiseHouseHolderPlanning = require("./initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("./initialiseFullPlanning");
module.exports = (statusOfOriginalApplication, planning, context) => {
	const basePage = new BasePage();
	cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
	cy.advanceToNextPage();
	cy.get(basePage?._selectors?.localPlanningDepartment)
		.type('System Test Borough Council')
		.get(basePage?._selectors?.localPlanningDepartmentOptionZero)
		.click();
	cy.advanceToNextPage();

	cy.get(`[data-cy="${planning}"]`).click();
	cy.advanceToNextPage();

	let grantedOrRefusedId = '';
	if (statusOfOriginalApplication === 'refused') {
		grantedOrRefusedId = basePage._selectors?.answerRefused;
	} else if (statusOfOriginalApplication === 'no decision') {
		grantedOrRefusedId =  basePage._selectors?.answerNodecisionreceived;
	} else {
		grantedOrRefusedId =  basePage._selectors?.answerGranted;
	}

	if (planning === "answer-full-appeal") {

		cy.get(basePage._selectors?.siteSelectionSeven).click();
		cy.advanceToNextPage();
		initialiseFullPlanning(statusOfOriginalApplication, planning, grantedOrRefusedId, 'Full Appeal', context);
	}
	else if (planning === "answer-householder-planning") {

		cy.getByData(basePage._selectors?.answerListedBuilding).click();
		cy.advanceToNextPage();

		statusOfOriginalApplication === 'refused' ? initialiseHouseHolderPlanning(statusOfOriginalApplication, planning, grantedOrRefusedId, context) : initialiseFullPlanning(statusOfOriginalApplication, planning, grantedOrRefusedId, 'Householder Planning', context);
	}
};
