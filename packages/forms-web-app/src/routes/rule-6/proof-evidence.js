const express = require('express');
const {
	list,
	question,
	save,
	// remove,
	submitRule6ProofEvidence,
	rule6ProofEvidenceSubmitted
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-rule-6-proof-evidence');
const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const setDefaultSection = require('../../dynamic-forms/middleware/set-default-section');
const redirectToUnansweredQuestion = require('../../dynamic-forms/middleware/redirect-to-unanswered-question');
const {
	rule6ProofEvidenceSkipConditions
} = require('../../dynamic-forms/middleware/redirect-middleware-conditions');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

// const { SERVICE_USER_TYPE } = require('pins-data-model');

const {
	VIEW: {
		RULE_6: { DASHBOARD }
	}
} = require('../../lib/views');
const dashboardUrl = `/${DASHBOARD}`;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const proofOfEvidenceTaskList = async (req, res) => {
	const referenceId = res.locals.journeyResponse.referenceId;
	const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(referenceId);

	appeal.appealTypeName = caseTypeNameWithDefault(appeal.appealTypeCode);

	const pageCaption = `Appeal ${appeal.caseReference}`;

	return list(req, res, pageCaption, { appeal });
};

// list
router.get(
	'/proof-evidence/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	redirectToUnansweredQuestion([rule6ProofEvidenceSkipConditions]),
	checkNotSubmitted(dashboardUrl),
	proofOfEvidenceTaskList
);

// submit
router.post(
	'/proof-evidence/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	validationErrorHandler,
	submitRule6ProofEvidence
);

router.get(
	'/proof-evidence/:referenceId/submitted-proof-evidence',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	rule6ProofEvidenceSubmitted
);

// question
router.get(
	'/proof-evidence/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	question
);

// save
router.post(
	'/proof-evidence/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// // remove answer - only available for some question types
// router.get(
// 	'/appeal-statement/:referenceId/:section/:question/:answerId',
// 	getJourneyResponse(),
// 	checkNotSubmitted(dashboardUrl),
// 	remove
// );

module.exports = router;
