const express = require('express');
const {
	list,
	question,
	save,
	// remove,
	submitRule6Statement,
	rule6StatementSubmitted
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-rule-6-statement');
const { getJourney } = require('../../dynamic-forms/middleware/get-journey');
const { journeys } = require('../../journeys');
const setDefaultSection = require('../../dynamic-forms/middleware/set-default-section');
const redirectToUnansweredQuestion = require('../../dynamic-forms/middleware/redirect-to-unanswered-question');
const {
	rule6StatementSkipConditions
} = require('../../dynamic-forms/middleware/redirect-middleware-conditions');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');

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
	redirectToUnansweredQuestion([rule6StatementSkipConditions]),
	checkNotSubmitted(dashboardUrl),
	statementTaskList
);

// submit
router.post(
	'/appeal-statement/:referenceId',
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	validationErrorHandler,
	submitRule6Statement
);

router.get(
	'/appeal-statement/:referenceId/submitted-appeal-statement',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	rule6StatementSubmitted
);

// question
router.get(
	'/appeal-statement/:referenceId/:question',
	setDefaultSection(),
	getJourneyResponse(),
	getJourney(journeys),
	checkNotSubmitted(dashboardUrl),
	question
);

// save
router.post(
	'/appeal-statement/:referenceId/:question',
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