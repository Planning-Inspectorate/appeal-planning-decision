// @ts-nocheck
/// <reference types="cypress"/>
const initialiseEnforcementPlanning = require('./initialiseEnforcementPlanning');
const { validateTypeOfDecisionRequested } = require('./appeal');

function submitEnforcementAppealFlow(appealOptions) {
	const { typeOfDecisionRequested, planning, context, prepareAppealData } = appealOptions;

	validateTypeOfDecisionRequested(typeOfDecisionRequested);

	if (planning !== 'answer-enforcement') {
		throw new Error(
			`The planning type "${planning}" is not supported for enforcement appeals!`
		);
	}

	initialiseEnforcementPlanning(planning, context, prepareAppealData);
}

module.exports = {
	submitEnforcementAppealFlow
};