// @ts-nocheck
/// <reference types="cypress"/>
import { enforcementAppealTestCases } from "../../../helpers/appellantAAPD/enforcement/enforcementData";
import { users } from '../../../fixtures/users.js';

const { submitEnforcementAppealFlow } = require('../../../support/flows/sections/appellantAAPD/enforcementAppeal');

describe('Submit Enforcement Appeal Test cases', { tags: '@enforcement' }, () => {
	let prepareAppealData;

	before(() => {
		cy.login(users.appeals.authUser);
	});

	beforeEach(() => {
		cy.fixture('prepareAppealData').then(data => {
			prepareAppealData = data;
		});
	});

	enforcementAppealTestCases.forEach((context) => {
		const {
			typeOfDecisionRequested,
			typeOfPlanningApplication,
			applicationForm,
			enforcementNotice
		} = context;

		//todo : need to double check that this is matchign enforcement journey...
		it(`
			- Should complete an enforcement appeal,
			- verify enforcement notice reference: "${enforcementNotice?.referenceNumber}",
			- validate the type of planning application as "${typeOfPlanningApplication}",
			- ensure the application form contains the correct details:
			* Is Appellant: "${applicationForm?.isAppellant}"
			* Is Inspector Access Needed: "${applicationForm?.isInspectorNeedAccess}"
			* Is Appellant Site Safety: "${applicationForm?.isAppellantSiteSafety}"
			* Appellant Procedure Preference: "${applicationForm?.appellantProcedurePreference}"
			* Any Other Appeals: "${applicationForm?.anyOtherAppeals}"
			* Is Appellant Linked Case Add: "${applicationForm?.isAppellantLinkedCaseAdd}"
		`, () => {
			submitEnforcementAppealFlow({
				typeOfDecisionRequested,
				planning: typeOfPlanningApplication,
				context,
				prepareAppealData
			});
		});
	});
});