const express = require('express');
const {
	list,
	question,
	save,
	remove,
	appellantSubmissionDeclaration,
	appellantSubmissionInformation,
	appellantSubmitted,
	submitAppellantSubmission,
	appellantBYSListOfDocuments,
	appellantStartAppeal
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-appellant');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { businessRulesDeadline } = require('../../lib/calculate-deadline');
const { mapTypeCodeToAppealId } = require('@pins/common');
const { format } = require('date-fns');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const checkDecisionDateDeadline = require('../../middleware/check-decision-date-deadline');
const checkAppealExists = require('../../middleware/check-appeal-exists');

const {
	VIEW: {
		APPEALS: { YOUR_APPEALS }
	}
} = require('#lib/views');
const dashboardUrl = `/${YOUR_APPEALS}`;

const typeCodeToTaskListDetails = {
	[CASE_TYPES.HAS.processCode]: {
		stub: 'householder',
		pageCaption: 'Householder Appeal'
	},
	[CASE_TYPES.S78.processCode]: {
		stub: 'full-planning',
		pageCaption: 'Planning Appeal'
	},
	[CASE_TYPES.S20.processCode]: {
		stub: 'listed-building',
		pageCaption: 'Planning Listed Building Appeal'
	}
};

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const appellantSubmissionTaskList = async (req, res) => {
	req.appealsApiClient;
	const journey = res.locals.journey;

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
		formattedDeadline,
		navigation: ['', dashboardUrl]
	});
};

router.get(
	'/appeal-form/before-you-start',
	checkAppealExists,
	checkDecisionDateDeadline,
	appellantBYSListOfDocuments
);

router.post(
	'/appeal-form/before-you-start',
	checkAppealExists,
	checkDecisionDateDeadline,
	appellantStartAppeal
);

router.get(
	'/appeal-form/your-appeal',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionTaskList
);

router.get(
	'/submit/declaration',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionDeclaration
);

router.post(
	'/submit/declaration',
	getJourneyResponse,
	getJourney(journeys),
	validationErrorHandler,
	submitAppellantSubmission
);

router.get(
	'/submit/information',
	getJourneyResponse,
	getJourney(journeys),
	appellantSubmissionInformation
);

router.get(
	'/submit/submitted',
	getJourneyResponse,
	getJourney(journeys),
	validationErrorHandler,
	appellantSubmitted
);

// question
router.get(
	'/:section/:question',
	getJourneyResponse,
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	question
);

// save
router.post(
	'/:section/:question',
	getJourneyResponse,
	getJourney(journeys),
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
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	remove
);

module.exports = router;
