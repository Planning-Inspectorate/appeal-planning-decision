// @ts-nocheck
/// <reference types="cypress"/>
import { PrepareAppealSelector } from "../../../../page-objects/prepare-appeal/prepare-appeal-selector";
import { BasePage } from "../../../../page-objects/base-page";
const initialiseHouseHolderPlanning = require("./initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("./initialiseFullPlanning");
const initialiseListedBuilding = require("./initialiseListedBuilding");
const initialiseCasPlanning = require("./initialiseCasPlanning");
const initialiseAdvertPlanning = require("./initialiseAdvertPlanning");

module.exports = (statusOfOriginalApplication, planning, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases = [], statementTestCases = []) => {
	const prepareAppealSelector = new PrepareAppealSelector();
	const basePage = new BasePage();
	// Visit the "Before You Start" page
	cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
	cy.advanceToNextPage();
	// Select the local planning authority
	cy.get(basePage?._selectors?.localPlanningDepartment).type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil);
	cy.get(basePage?._selectors?.localPlanningDepartmentOptionZero).click();
	cy.advanceToNextPage();

	//cy.pause(); //test 

	// Select the enforcement notice as 'No'
	cy.getByData(basePage?._selectors.answerYes).click();
	cy.advanceToNextPage();
	// Select the application type
	cy.get(`[data-cy="${planning}"]`).click();
	cy.advanceToNextPage();

	if (planning === prepareAppealSelector?._selectors?.answerMinorCommercialDevelopment) {
	 //planning-application-about if any one or all 4  check boxes selects then it should go to s78 route other wise cas planning
		if(context?.selectAllPlanningApplicationAbout) {
			cy.get('#planningApplicationAbout').click();
			cy.get('#planningApplicationAbout-2').click();
			cy.get('#planningApplicationAbout-3').click();
			cy.get('#planningApplicationAbout-4').click();	
			//any one of the above selected then s78 route
		} else {
			cy.get('#planningApplicationAbout-6').click();
		}
			//casplanning route
		cy.advanceToNextPage();
	}	
		
	// Select the application decision granted or refused or no decision
	let grantedOrRefusedId = '';
	if (statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused) {
		grantedOrRefusedId = basePage._selectors?.answerRefused;
	} else if (statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationNoDecision) {
		grantedOrRefusedId = basePage._selectors?.answerNodecisionreceived;
	} else {
		grantedOrRefusedId =  basePage._selectors?.answerGranted;
	}	
	if (planning === prepareAppealSelector?._selectors?.answerFullAppeal) {		
		initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.fullAppealText, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
	} else if (planning === prepareAppealSelector?._selectors?.answerListedBuilding) {		
		initialiseListedBuilding(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.listedBuildingText, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
	} else if (planning === prepareAppealSelector?._selectors?.answerHouseholderPlanning) {	
		statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused ? 
		initialiseHouseHolderPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.householderPlanningText, context, prepareAppealData,  lpaManageAppealsData,questionnaireTestCases, statementTestCases) : initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.householderPlanningText, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases);	
	} else if (planning === prepareAppealSelector?._selectors?.answerMinorCommercialDevelopment) {
		if(context?.selectAllPlanningApplicationAbout) {
			//s78 route
			initialiseFullPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.casPlanningText, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
		} else {
			//cas planning route
			initialiseCasPlanning(planning, grantedOrRefusedId,  prepareAppealSelector?._selectors?.casPlanningText,context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases)
		}
	} else if (planning === prepareAppealSelector?._selectors?.answerMinorCommercialAdvertisement) {
		statusOfOriginalApplication === prepareAppealSelector?._selectors?.statusOfOriginalApplicationRefused ? 
		initialiseAdvertPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.advertText,context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases) : initialiseAdvertPlanning(planning, grantedOrRefusedId, prepareAppealSelector?._selectors?.advertText,context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
	}
};