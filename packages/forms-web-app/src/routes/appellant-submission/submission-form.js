const express = require('express');
const {
	list,
	question,
	save,
	remove,
	appellantSubmissionDeclaration,
	appellantSubmissionInformation,
	appellantSubmitted,
	submitAppellantSubmission
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-appellant');
const { getJourney } = require('../../dynamic-forms/journey-factory');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { businessRulesDeadline } = require('../../lib/calculate-deadline');
const { mapTypeCodeToAppealId } = require('../../lib/full-appeal/map-planning-application');
const { format } = require('date-fns');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');

const {
	VIEW: {
		APPEALS: { YOUR_APPEALS }
	}
} = require('#lib/views');
const dashboardUrl = `/${YOUR_APPEALS}`;

const typeCodeToTaskListDetails = {
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS]: {
		stub: 'householder',
		pageCaption: 'Householder Appeal'
	},
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78]: {
		stub: 'full-planning',
		pageCaption: 'Full Planning Appeal'
	}
};

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const appellantSubmissionTaskList = async (req, res) => {
	const journey = getJourney(res.locals.journeyResponse);

	const appealType = journey.response.answers.appealTypeCode;

	const deadline = businessRulesDeadline(
		journey.response.answers.applicationDecisionDate,
		mapTypeCodeToAppealId(appealType),
		null,
		true
	);
	const formattedDeadline = format(deadline, 'dd MMM yyyy');

	const declarationUrl = `/appeals/${typeCodeToTaskListDetails[appealType].stub}/submit/declaration?id=${journey.response.referenceId}`;

	return list(req, res, typeCodeToTaskListDetails[appealType].pageCaption, {
		declarationUrl,
		formattedDeadline
	});
};

router.get(
	'/appeal-form/your-appeal',
	getJourneyResponse,
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionTaskList
);

router.get(
	'/submit/declaration',
	getJourneyResponse,
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionDeclaration
);

router.post(
	'/submit/declaration',
	getJourneyResponse,
	validationErrorHandler,
	submitAppellantSubmission
);

router.get('/submit/information', getJourneyResponse, appellantSubmissionInformation);

router.get('/submit/submitted', getJourneyResponse, validationErrorHandler, appellantSubmitted);

// question
router.get('/:section/:question', getJourneyResponse, checkNotSubmitted(dashboardUrl), question);

// save
router.post(
	'/:section/:question',
	getJourneyResponse,
	checkNotSubmitted(dashboardUrl),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get(
	'/:section/:question/:answerId',
	getJourneyResponse,
	checkNotSubmitted(dashboardUrl),
	remove
);

module.exports = router;
