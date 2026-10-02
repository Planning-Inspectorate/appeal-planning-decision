// @ts-nocheck
/// <reference types="cypress"/>
import { outlinePlanningGrantedTestCases } from "../../../helpers/appellantAAPD/outlinePlanning/outlinePlanningGrantedData";
import { fullAppealQuestionnaireTestCases as questionnaireTestCases } from "../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData";
import { statementTestCases } from "../../../helpers/lpaManageAppeals/statementData";
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require("../../../support/flows/sections/appellantAAPD/appeal");

describe("Submit Outline Planning Appeal Granted Test cases", { tags: "@outline-planning-granted" }, () => {
	let prepareAppealData;
	let lpaManageAppealsData;
	before(() => {
		cy.login(users.appeals.authUser);
	});
	beforeEach(() => {
		cy.fixture("prepareAppealData").then(data => {
			prepareAppealData = data;
		});
		cy.fixture("lpaManageAppealsData").then(data => {
			lpaManageAppealsData = data;
		});
	});

	outlinePlanningGrantedTestCases.forEach((context) => {
		const {
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,
			typeOfPlanningApplication,
			expeditedAppeal,
			applicationForm
		} = context;
		it(`
			- Should check the status of the original application,
			- verify the status of planning obligation as "${statusOfPlanningObligation}",
			- validate the type of planning application as "${typeOfPlanningApplication}",
			- verify if the appeal is expedited: "${expeditedAppeal}",
			- ensure the application form contains the expected details:
			* is Appellant: "${applicationForm?.isAppellant}"
			* Area Units: "${applicationForm?.areaUnits}"
			* Appellant in Green Belt: "${applicationForm?.appellantInGreenBelt}"
			* Owns All Land: "${applicationForm?.isOwnsAllLand}"
			* Owns Some Land: "${applicationForm?.isOwnsSomeLand}"
			* Knows Other Owners: "${applicationForm?.knowsOtherOwners}"
			* Agricultural Holding: "${applicationForm?.isAgriculturalHolding}"
			* Inspector Access Needed: "${applicationForm?.isInspectorNeedAccess}"
			* Appellant Site Safety: "${applicationForm?.isAppellantSiteSafety}"
			* Development Description Updated: "${applicationForm?.iaUpdateDevelopmentDescription}"
			* Procedure Preference: "${applicationForm?.appellantProcedurePreference}"
			* Other Appeals: "${applicationForm?.anyOtherAppeals}"
			* Linked Case Added: "${applicationForm?.isAppellantLinkedCaseAdd}"
		`, { tags: context.tags || [] }, () => {
			submitAppealFlow({
				statusOfOriginalApplication,
				typeOfDecisionRequested,
				statusOfPlanningObligation,
				planning: typeOfPlanningApplication,
				expeditedAppeal,
				context,
				prepareAppealData,
				lpaManageAppealsData,
				questionnaireTestCases,
				statementTestCases
			});
		});
	});
});