const express = require('express');
const {
	list,
	question,
	save,
	remove,
	submitAppellantStatement,
	appealStatementSubmitted,
	startJourneyFromBeginning
} = require('../../../dynamic-forms/controller');
const validate = require('@pins/dynamic-forms/src/validator/validator');
const {
	validationErrorHandler
} = require('@pins/dynamic-forms/src/validator/validation-error-handler');
const getJourneyResponse = require('../../../dynamic-forms/middleware/get-journey-response-for-appellant-statement');
const setDefaultSection = require('../../../dynamic-forms/middleware/set-default-section');
const dynamicReqFilesToReqBodyFiles = require('../../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');
const { getJourney } = require('../../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../../journeys');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const {
	VIEW: {
		SELECTED_APPEAL: { APPEAL_OVERVIEW }
	}
} = require('#lib/views');

const appealOverviewUrl = APPEAL_OVERVIEW;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const statementTaskList = async (req, res) => {
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
	checkNotSubmitted(appealOverviewUrl),
	statementTaskList
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

router.get(
	'/:referenceId/submitted-appeal-statement',
	getJourneyResponse(false),
	getJourney(journeys),
	validationErrorHandler,
	appealStatementSubmitted
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

// submit
router.post(
	'/:referenceId/',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	validationErrorHandler,
	submitAppellantStatement
);

// remove answer - only available for some question types
router.get(
	'/:referenceId/:question/:answerId',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	remove
);

module.exports = router;
