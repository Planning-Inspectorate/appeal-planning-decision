// @ts-nocheck
/// <reference types="cypress"/>
const initialiseApplicationTypeAppeal = require('./sections/initialiseApplicationTypeAppeal');

function submitAppealFlow(appealOptions) {
	const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, planning, context, prepareAppealData, lpaManageAppealsData, fullAppealQuestionnaireTestCases, fullAppealStatementTestCases } =
		appealOptions;

	if (['granted', 'refused', 'no decision'].includes(statusOfOriginalApplication) === false) {
		throw new Error(
			`The status of original application "${statusOfOriginalApplication}" is not supported!`
		);
	}

	if (['written', 'hearing', 'inquiry'].includes(typeOfDecisionRequested) === false) {
		throw new Error(
			`The stype of decision requested "${typeOfDecisionRequested}" is not supported!`
		);
	}

	if (['not started', 'finalised', 'in draft'].includes(statusOfPlanningObligation) === false) {
		throw new Error(
			`The status of planning obligation "${statusOfPlanningObligation}" is not supported!`
		);
	}

	initialiseApplicationTypeAppeal(statusOfOriginalApplication, planning, context, prepareAppealData, lpaManageAppealsData, fullAppealQuestionnaireTestCases, fullAppealStatementTestCases);
}

module.exports = {
	submitAppealFlow
};
