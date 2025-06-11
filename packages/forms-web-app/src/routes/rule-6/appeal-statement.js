const express = require('express');
const {
	list,
	question,
	save,
	submitRule6Statement,
	rule6StatementSubmitted,
	startJourneyFromBeginning
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-rule-6-statement');
const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const setDefaultSection = require('../../dynamic-forms/middleware/set-default-section');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

const {
	VIEW: {
		RULE_6: { APPEAL_OVERVIEW }
	}
} = require('../../lib/views');
const appealOverviewUrl = APPEAL_OVERVIEW;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const statementTaskList = async (req, res) => {
	const referenceId = res.locals.journeyResponse.referenceId;
	const appeal = await req.appealsApiClient.getAppealCaseByCaseRef(referenceId);

	appeal.appealTypeName = caseTypeNameWithDefault(appeal.appealTypeCode);

	const pageCaption = `Appeal ${appeal.caseReference}`;

	return list(req, res, pageCaption, { appeal });
};

// list
router.get(
	'/appeal-statement/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	statementTaskList
);

// entry
/** @type {import('express').RequestHandler} */
router.get(
	'/appeal-statement/:referenceId/entry',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	startJourneyFromBeginning
);

// submit
router.post(
	'/appeal-statement/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	validationErrorHandler,
	submitRule6Statement
);

router.get(
	'/appeal-statement/:referenceId/submitted-appeal-statement',
	setDefaultSection(),
	getJourneyResponse(false),
	getJourney(journeys),
	rule6StatementSubmitted
);

// question
router.get(
	'/appeal-statement/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(appealOverviewUrl),
	question
);

// save
router.post(
	'/appeal-statement/:referenceId/:question',
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
