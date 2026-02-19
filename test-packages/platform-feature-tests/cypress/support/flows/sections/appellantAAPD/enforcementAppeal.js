// @ts-nocheck
/// <reference types="cypress"/>
const initialiseEnforcementPlanning = require('./initialiseEnforcementPlanning');

function submitEnforcementAppealFlow(appealOptions) {
	const { typeOfDecisionRequested, planning, context, prepareAppealData } = appealOptions;

	if (['written', 'hearing', 'inquiry'].includes(typeOfDecisionRequested) === false) {
		throw new Error(
			`The type of decision requested "${typeOfDecisionRequested}" is not supported!`
		);
	}

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