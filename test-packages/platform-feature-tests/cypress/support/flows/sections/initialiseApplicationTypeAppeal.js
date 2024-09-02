import { PrepareAppealSelector } from "../../../page-objects/prepare-appeal/prepare-appeal-selector";
import { BasePage } from "../../../page-objects/base-page";
const initialiseHouseHolderPlanning = require("./initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("./initialiseFullPlanning");
module.exports = (statusOfOriginalApplication, planning, context, prepareAppealData) => {
	const prepareAppealSelector = new PrepareAppealSelector();
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
	if (statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused) {
		grantedOrRefusedId = basePage._selectors?.answerRefused;
	} else if (statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationNoDecision) {
		grantedOrRefusedId =  basePage._selectors?.answerNodecisionreceived;
	} else {
		grantedOrRefusedId =  basePage._selectors?.answerGranted;
	}

	if (planning === prepareAppealSelector?._selectors?.answerFullAppeal) {

		cy.get(basePage._selectors?.siteSelectionSeven).click();
		cy.advanceToNextPage();
		initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.fullAppealText, context, prepareAppealData);
	}
	else if (planning === prepareAppealSelector?._selectors?.answerHouseholderPlanning) {

		cy.getByData(basePage._selectors?.answerListedBuilding).click();
		cy.advanceToNextPage();

		statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused ? initialiseHouseHolderPlanning(planning, grantedOrRefusedId, context, prepareAppealData) : initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.householderPlanningText, context, prepareAppealData);
	}
};
