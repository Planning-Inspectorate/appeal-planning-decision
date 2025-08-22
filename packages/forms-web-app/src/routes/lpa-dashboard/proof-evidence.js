const express = require('express');
const {
	list,
	question,
	save,
	submitLpaProofEvidence,
	lpaProofEvidenceSubmitted,
	startJourneyFromBeginning
} = require('../../dynamic-forms/controller');
const validate = require('@pins/dynamic-forms/src/validator/validator');
const {
	validationErrorHandler
} = require('@pins/dynamic-forms/src/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-lpa-proof-evidence');
const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const setDefaultSection = require('../../dynamic-forms/middleware/set-default-section');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const {
	VIEW: {
		LPA_DASHBOARD: { APPEAL_OVERVIEW }
	}
} = require('../../lib/views');
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
	'/proof-evidence/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	proofOfEvidenceTaskList
);

// entry
/** @type {import('express').RequestHandler} */
router.get(
	'/proof-evidence/:referenceId/entry',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	startJourneyFromBeginning
);

// submit
router.post(
	'/proof-evidence/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	validationErrorHandler,
	submitLpaProofEvidence
);

router.get(
	'/proof-evidence/:referenceId/submitted-proof-evidence',
	setDefaultSection(),
	getJourneyResponse(false),
	getJourney(journeys),
	lpaProofEvidenceSubmitted
);

// question
router.get(
	'/proof-evidence/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	question
);

// save
router.post(
	'/proof-evidence/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

module.exports = router;
