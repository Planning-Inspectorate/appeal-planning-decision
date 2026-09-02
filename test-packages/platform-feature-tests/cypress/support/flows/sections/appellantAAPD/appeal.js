// @ts-nocheck
/// <reference types="cypress"/>
const initialiseApplicationTypeAppeal = require('./initialiseApplicationTypeAppeal');

function validateTypeOfDecisionRequested(typeOfDecisionRequested) {
	if (['written', 'hearing', 'inquiry'].includes(typeOfDecisionRequested) === false) {
		throw new Error(
			`The type of decision requested "${typeOfDecisionRequested}" is not supported!`
		);
	}
}

function submitAppealFlow(appealOptions) {
	const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, planning, expeditedAppeal, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases } =
		appealOptions;

	if (['granted', 'refused', 'no decision', 'no listed building'].includes(statusOfOriginalApplication) === false) {
		throw new Error(
			`The status of original application "${statusOfOriginalApplication}" is not supported!`
		);
	}

	validateTypeOfDecisionRequested(typeOfDecisionRequested);

	if (['not started', 'finalised', 'in draft'].includes(statusOfPlanningObligation) === false) {
		throw new Error(
			`The status of planning obligation "${statusOfPlanningObligation}" is not supported!`
		);
	}
	initialiseApplicationTypeAppeal(statusOfOriginalApplication, planning, expeditedAppeal, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
}
module.exports = {
	submitAppealFlow,
	validateTypeOfDecisionRequested
};
