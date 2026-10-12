// @ts-nocheck
/// <reference types="cypress"/>

import { priorApprovalRefusedTestCases } from '../../../helpers/appellantAAPD/priorApproval/priorApprovalRefusedData';
import { houseHolderQuestionnaireTestCases } from '../../../helpers/lpaManageAppeals/houseHolderQuestionnaireData';
import { fullAppealQuestionnaireTestCases } from '../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData';
import { statementTestCases } from '../../../helpers/lpaManageAppeals/statementData';
import { users } from '../../../fixtures/users.js';
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit Prior Approval Refused Test cases', { tags: '@prior-approval-refused' }, () => {
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

	priorApprovalRefusedTestCases.forEach((context, index) => {
		const questionnaireTestCases = context.hasPriorApprovalForExistingHome === true
			? houseHolderQuestionnaireTestCases
			: fullAppealQuestionnaireTestCases;
		it(`Case ${index + 1}: submit refused prior approval with existing-home ${context.hasPriorApprovalForExistingHome ? 'yes' : 'no'}, ${context.typeOfDecisionRequested} procedure, ${context.statusOfPlanningObligation} obligation and expedited appeal ${Boolean(context.expeditedAppeal)}`, { tags: context.tags || [] }, () => {
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