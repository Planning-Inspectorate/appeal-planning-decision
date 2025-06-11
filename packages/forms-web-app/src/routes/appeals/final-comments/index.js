const express = require('express');
const {
	list,
	question,
	save,
	submitAppellantFinalComment,
	appellantFinalCommentSubmitted,
	startJourneyFromBeginning
} = require('../../../dynamic-forms/controller');
const validate = require('../../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../../dynamic-forms/middleware/get-journey-response-for-appellant-final-comments');
const { getJourney } = require('../../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../../journeys');
const setDefaultSection = require('../../../dynamic-forms/middleware/set-default-section');
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

/** @type {import('express').RequestHandler} */
const finalCommentsTaskList = async (req, res) => {
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
/** @type {import('express').RequestHandler} */
router.get(
	'/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	finalCommentsTaskList
);

// entry
/** @type {import('express').RequestHandler} */
router.get(
	'/:referenceId/entry',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	startJourneyFromBeginning
);

// submit
/** @type {import('express').RequestHandler} */
router.post(
	'/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	validationErrorHandler,
	submitAppellantFinalComment
);

/** @type {import('express').RequestHandler} */
router.get(
	'/:referenceId/submitted',
	setDefaultSection(),
	getJourneyResponse(false),
	getJourney(journeys),
	appellantFinalCommentSubmitted
);

// question
/** @type {import('express').RequestHandler} */
router.get(
	'/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	question
);

// save
/** @type {import('express').RequestHandler} */
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

module.exports = router;
