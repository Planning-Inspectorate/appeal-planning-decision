// @ts-nocheck
/// <reference types="cypress"/>

import { casPlanningAppealNoDecisionTestCases } from "../../../helpers/appellantAAPD/casPlanningAppeal/casPlanningAppealNoDecisionData";
import { fullAppealQuestionnaireTestCases } from "../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData";
import { casPlanningQuestionnaireTestCases } from "../../../helpers/lpaManageAppeals/casPlanningQuestionnaireData";
import { statementTestCases } from "../../../helpers/lpaManageAppeals/statementData";
import { users } from "../../../fixtures/users.js";
import { tag } from '#support/tag.js';

const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit CAS Planning Appeal No Decision Test Cases', { tags: '@CAS-Planning-nodecision' }, () => {
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
	casPlanningAppealNoDecisionTestCases.forEach((context) => {
		const {
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,
			typeOfPlanningApplication,
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
				prepareAppealData
			});
		});
	});

	// example smoke test case
	it('CAS Smoke Test', { tags: tag.smoke }, () => {
		const context = casPlanningAppealNoDecisionTestCases[0];
		const {
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,
			typeOfPlanningApplication,
			selectAllPlanningApplicationAbout,
		} = context;

		submitAppealFlow({
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,
			planning: typeOfPlanningApplication,
			context,
			prepareAppealData,
			lpaManageAppealsData,
			questionnaireTestCases: selectAllPlanningApplicationAbout ? fullAppealQuestionnaireTestCases : casPlanningQuestionnaireTestCases,
			statementTestCases
		});
	});

});
