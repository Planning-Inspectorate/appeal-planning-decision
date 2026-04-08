const express = require('express');
const { selectedAppeal } = require('./controller');
const { loadAppeal } = require('#middleware/load-appeal');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

const router = express.Router({ mergeParams: true });

router.get(
	'/',
	loadAppeal(/** @type {import('express').Handler} */ (req) => req.params.appealNumber, {
		// case data
		caseReference: true,
		appealTypeCode: true,
		LPACode: true,
		caseProcedure: true,
		caseStatus: true,
		applicationReference: true,
		enforcementReference: true,

		// address
		siteAddressLine1: true,
		siteAddressLine2: true,
		siteAddressTown: true,
		siteAddressPostcode: true,
		siteGridReferenceEasting: true,
		siteGridReferenceNorthing: true,

		// decision
		caseDecisionOutcome: true,
		caseDecisionOutcomeDate: true,

		// due dates
		interestedPartyRepsDueDate: true,

		// includes:
		Documents: {
			select: {
				id: true,
				filename: true,
				documentType: true
			},
			where: {
				documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER
			}
		},
		Events: {
			select: {
				type: true,
				startDate: true
			}
		},

		// extras
		users: true,
		linkedCases: true
	}),
	asyncHandler(selectedAppeal)
);

module.exports = { router };
