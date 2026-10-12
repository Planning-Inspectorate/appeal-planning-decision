// @ts-nocheck
/// <reference types="cypress"/>

import { priorApprovalNoDecisionTestCases } from '../../../helpers/appellantAAPD/priorApproval/priorApprovalNoDecisionData';
import { fullAppealQuestionnaireTestCases as questionnaireTestCases } from '../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData';
import { statementTestCases } from '../../../helpers/lpaManageAppeals/statementData';
import { users } from '../../../fixtures/users.js';
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit Prior Approval No Decision Test cases', { tags: '@prior-approval-nodecision' }, () => {
	let prepareAppealData;
	let lpaManageAppealsData;

	before(() => {
		cy.login(users.appeals.authUser);
	});

	beforeEach(() => {
		cy.fixture('prepareAppealData').then((data) => {
			prepareAppealData = data;
		});
		cy.fixture('lpaManageAppealsData').then((data) => {
			lpaManageAppealsData = data;
		});
	});

	priorApprovalNoDecisionTestCases.forEach((context, index) => {
		it(`Case ${index + 1}: submit no-decision prior approval with existing-home ${context.hasPriorApprovalForExistingHome ? 'yes' : 'no'}, ${context.typeOfDecisionRequested} procedure and ${context.statusOfPlanningObligation} obligation`, { tags: context.tags || [] }, () => {
			submitAppealFlow({
				statusOfOriginalApplication: context.statusOfOriginalApplication,
				typeOfDecisionRequested: context.typeOfDecisionRequested,
				statusOfPlanningObligation: context.statusOfPlanningObligation,
				planning: context.typeOfPlanningApplication,
				expeditedAppeal: context.expeditedAppeal,
				context,
				prepareAppealData,
				lpaManageAppealsData,
				questionnaireTestCases,
				statementTestCases
			});
		});
	});
});