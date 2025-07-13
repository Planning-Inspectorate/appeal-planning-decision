// @ts-nocheck
/// <reference types="cypress"/>
import { PrepareAppealSelector } from "../../../../page-objects/prepare-appeal/prepare-appeal-selector";
import { BasePage } from "../../../../page-objects/base-page";
const initialiseHouseHolderPlanning = require("./initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("./initialiseFullPlanning");
const initialiseListedBuilding = require("./initialiseListedBuilding");
module.exports = (statusOfOriginalApplication, planning, context, prepareAppealData) => {
	const prepareAppealSelector = new PrepareAppealSelector();
	const basePage = new BasePage();
	// Visit the "Before You Start" page
	cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
	cy.advanceToNextPage();
	// Select the local planning department
	cy.get(basePage?._selectors?.localPlanningDepartment)
		.type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil)
		.get(basePage?._selectors?.localPlanningDepartmentOptionZero)
		.click();
	cy.advanceToNextPage();
	// Select the enforcement notice as 'No'
	cy.getByData(basePage?._selectors.answerNo).click();
	cy.advanceToNextPage();
	// Select the application type
	cy.get(`[data-cy="${planning}"]`).click();
	cy.advanceToNextPage();
	// Select the application decision granted or refused or no decision
	let grantedOrRefusedId = '';
	if (statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused) {
		grantedOrRefusedId = basePage._selectors?.answerRefused;
	} else if (statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationNoDecision) {
		grantedOrRefusedId =  basePage._selectors?.answerNodecisionreceived;
	} else {
		grantedOrRefusedId =  basePage._selectors?.answerGranted;
	}	
	if (planning === prepareAppealSelector?._selectors?.answerFullAppeal) {		
		initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.fullAppealText, context, prepareAppealData);
	} else if (planning === prepareAppealSelector?._selectors?.answerListedBuilding) {		
		initialiseListedBuilding(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.listedBuildingText, context, prepareAppealData);
	} else if (planning === prepareAppealSelector?._selectors?.answerHouseholderPlanning) {
		statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused ? initialiseHouseHolderPlanning(planning, grantedOrRefusedId, context, prepareAppealData) : initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.householderPlanningText, context, prepareAppealData);
	}
};
