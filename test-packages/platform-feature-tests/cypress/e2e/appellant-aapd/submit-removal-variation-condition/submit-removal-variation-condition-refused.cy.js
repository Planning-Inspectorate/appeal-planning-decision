// @ts-nocheck
/// <reference types="cypress"/>

import { removalVariationConditionRefusedTestCases } from '../../../helpers/appellantAAPD/removalVariationCondition/removalVariationConditionRefusedData';
import { listedBuildingQuestionnaireTestCases } from '../../../helpers/lpaManageAppeals/listedBuildingQuestionnaireData';
import { houseHolderQuestionnaireTestCases } from '../../../helpers/lpaManageAppeals/houseHolderQuestionnaireData';
import { statementTestCases } from '../../../helpers/lpaManageAppeals/statementData';
import { users } from '../../../fixtures/users.js';
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit removal or variation of conditions refused cases', { tags: '@removal-variation-refused' }, () => {
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

	removalVariationConditionRefusedTestCases.forEach((context) => {
		const questionnaireTestCases = context.isListedBuilding
			? listedBuildingQuestionnaireTestCases
			: houseHolderQuestionnaireTestCases;
		it(`submit refused ${context.isListedBuilding ? 'listed-building' : 'non-listed-building'} condition appeal with ${context.typeOfDecisionRequested} procedure`, { tags: context.tags || [] }, () => {
			submitAppealFlow({
				statusOfOriginalApplication: context.statusOfOriginalApplication,
				typeOfDecisionRequested: context.typeOfDecisionRequested,
				statusOfPlanningObligation: context.statusOfPlanningObligation,
				planning: context.typeOfPlanningApplication,
				context,
				prepareAppealData,
				lpaManageAppealsData,
				questionnaireTestCases,
				statementTestCases
			});
		});
	});
});