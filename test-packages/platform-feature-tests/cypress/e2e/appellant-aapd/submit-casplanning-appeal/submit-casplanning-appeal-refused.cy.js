// @ts-nocheck
/// <reference types="cypress"/>

import { casPlanningAppealRefusedTestCases } from "../../../helpers/appellantAAPD/casPlanningAppeal/casPlanningAppealRefusedData";
import { fullAppealQuestionnaireTestCases } from "../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData";
import { casPlanningQuestionnaireTestCases } from "../../../helpers/lpaManageAppeals/casPlanningQuestionnaireData";
import { statementTestCases } from "../../../helpers/lpaManageAppeals/statementData";
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit Cas Planning Appeal Refused Test Cases', { tags: '@CAS-Planning-refused' }, () => {
	let prepareAppealData;
	let lpaManageAppealsData;
	before(() => {
		cy.login(users.appeals.authUser);
	});
	beforeEach(() => {
		cy.fixture('prepareAppealData').then(data => {
			prepareAppealData = data;
		});
		cy.fixture('lpaManageAppealsData').then(data => {
			lpaManageAppealsData = data;
		});
	});
	casPlanningAppealRefusedTestCases.forEach((context) => {
		const {
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,
			typeOfPlanningApplication,
			selectAllPlanningApplicationAbout,
			applicationForm,
		} = context;

		it(`
			- Should check the status of the original application,
			- verify the status of original application "${statusOfOriginalApplication}",
			- validate the type of planning application as "${typeOfPlanningApplication}",
			- verify the status of planning obligation as "${statusOfPlanningObligation}",
			- ensure the application form contains the correct details:
			* is Appellant: "${applicationForm?.isAppellant}"
			* ${applicationForm?.areaUnits !== undefined ? `Area Units: "${applicationForm?.areaUnits}" ` : "Area Units not required"}
			* appellant in Green Belt: "${applicationForm?.appellantInGreenBelt}"
			* Is Owns All Land: "${applicationForm?.isOwnsAllLand}"
			* Is Owns Some Land: "${applicationForm?.isOwnsSomeLand}"
			* Knows Other Owners: "${applicationForm?.knowsOtherOwners}"			
			* ${applicationForm?.isAgriculturalHolding !== undefined ? ` Is Agricultural Holding:  "${applicationForm?.isAgriculturalHolding}" ` : "Agricultural Holding not required"}
			* ${applicationForm?.anyOtherTenants !== undefined ? ` Any Other Tenants:  "${applicationForm?.anyOtherTenants}" ` : "No Other tenants needed"}
			* Is Inspector Access Needed: "${applicationForm?.isInspectorNeedAccess}"
			* Is Appellant Site Safety: "${applicationForm?.isAppellantSiteSafety}"
			* Is Development Description updated: "${applicationForm?.iaUpdateDevelopmentDescription}"
			* Appellant Procedure Preference: "${applicationForm?.appellantProcedurePreference}"
			* Any Other appeals: "${applicationForm?.anyOtherAppeals}"
			* Is Appellant Linked Case Add: "${applicationForm?.isAppellantLinkedCaseAdd}"
			* 		
		 `, () => {
			submitAppealFlow({
				statusOfOriginalApplication,
				typeOfDecisionRequested,
				statusOfPlanningObligation,
				planning: typeOfPlanningApplication,
				context,
				prepareAppealData,
				lpaManageAppealsData,
				questionnaireTestCases: selectAllPlanningApplicationAbout ? fullAppealQuestionnaireTestCases : casPlanningQuestionnaireTestCases,
				statementTestCases,
			});
		});
	});
});