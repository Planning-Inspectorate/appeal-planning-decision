const express = require('express');
const {
	list,
	question,
	save,
	// remove,
	submitAppellantProofEvidence,
	appellantProofEvidenceSubmitted
} = require('../../../dynamic-forms/controller');
const validate = require('../../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../../dynamic-forms/middleware/get-journey-response-for-appellant-proof-evidence');
const { getJourney } = require('../../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../../journeys');
const setDefaultSection = require('../../../dynamic-forms/middleware/set-default-section');
const redirectToUnansweredQuestion = require('../../../dynamic-forms/middleware/redirect-to-unanswered-question');
const {
	appellantProofEvidenceSkipConditions
} = require('../../../dynamic-forms/middleware/redirect-middleware-conditions');
const dynamicReqFilesToReqBodyFiles = require('../../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

const { SERVICE_USER_TYPE } = require('pins-data-model');

const {
	VIEW: {
		SELECTED_APPEAL: { APPEAL_OVERVIEW }
	}
} = require('../../../lib/views');
const appealOverviewUrl = APPEAL_OVERVIEW;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const proofOfEvidenceTaskList = async (req, res) => {
	const referenceId = res.locals.journeyResponse.referenceId;
	const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(referenceId);

	appeal.appealTypeName = caseTypeNameWithDefault(appeal.appealTypeCode);
	const appellant = appeal.users.find((x) => x.serviceUserType === SERVICE_USER_TYPE.APPELLANT);
	if (appellant) {
		appeal.appellantFirstName = appellant.firstName;
		appeal.appellantLastName = appellant.lastName;
	}

	const pageCaption = `Appeal ${appeal.caseReference}`;

	return list(req, res, pageCaption, { appeal });
};

// list
router.get(
	'/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	redirectToUnansweredQuestion([appellantProofEvidenceSkipConditions]),
	checkNotSubmitted(appealOverviewUrl),
	proofOfEvidenceTaskList
);

// submit
router.post(
	'/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	validationErrorHandler,
	submitAppellantProofEvidence
);

router.get(
	'/:referenceId/submitted-proof-evidence',
	setDefaultSection(),
	getJourneyResponse(false),
	getJourney(journeys),
	appellantProofEvidenceSubmitted
);

// question
router.get(
	'/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	question
);

// save
router.post(
	'/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
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
