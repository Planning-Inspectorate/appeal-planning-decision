// @ts-nocheck
/// <reference types="cypress"/>

import { priorApprovalGrantedTestCases } from '../../../helpers/appellantAAPD/priorApproval/priorApprovalGrantedData';
import { fullAppealQuestionnaireTestCases as questionnaireTestCases } from '../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData';
import { statementTestCases } from '../../../helpers/lpaManageAppeals/statementData';
import { users } from '../../../fixtures/users.js';
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit Prior Approval Granted Test cases', { tags: '@prior-approval-granted' }, () => {
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

	priorApprovalGrantedTestCases.forEach((context, index) => {
		it(`Case ${index + 1}: submit granted prior approval with existing-home ${context.hasPriorApprovalForExistingHome ? 'yes' : 'no'}, ${context.typeOfDecisionRequested} procedure, ${context.statusOfPlanningObligation} obligation and expedited appeal ${Boolean(context.expeditedAppeal)}`, { tags: context.tags || [] }, () => {
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