// @ts-nocheck
/// <reference types="cypress"/>

import { removalVariationConditionGrantedTestCases } from '../../../helpers/appellantAAPD/removalVariationCondition/removalVariationConditionGrantedData';
import { listedBuildingQuestionnaireTestCases } from '../../../helpers/lpaManageAppeals/listedBuildingQuestionnaireData';
import { fullAppealQuestionnaireTestCases } from '../../../helpers/lpaManageAppeals/fullAppealQuestionnaireData';
import { statementTestCases } from '../../../helpers/lpaManageAppeals/statementData';
import { users } from '../../../fixtures/users.js';
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe('Submit removal or variation of conditions granted cases', { tags: '@removal-variation-granted' }, () => {
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

	removalVariationConditionGrantedTestCases.forEach((context) => {
		const questionnaireTestCases = context.isListedBuilding
			? listedBuildingQuestionnaireTestCases
			: fullAppealQuestionnaireTestCases;
		it(`submit granted ${context.isListedBuilding ? 'listed-building' : 'non-listed-building'} condition appeal with ${context.typeOfDecisionRequested} procedure`, { tags: context.tags || [] }, () => {
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