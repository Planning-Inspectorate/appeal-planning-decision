const express = require('express');
const {
	list,
	question,
	save,
	remove,
	appellantSubmissionDeclaration,
	appellantSubmitted,
	appellantSubmit
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-appellant');
const checkNotSubmitted = require('../../dynamic-forms/middleware/check-not-submitted');

const {
	VIEW: {
		APPEALS: { YOUR_APPEALS }
	}
} = require('#lib/views');
const dashboardUrl = `/${YOUR_APPEALS}`;

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const householderTaskList = async (req, res) => {
	return list(req, res, 'Householder Appeal', {});
};

router.get(
	'/appeal-form/your-appeal',
	getJourneyResponse,
	checkNotSubmitted(dashboardUrl),
	householderTaskList
);

router.get(
	'/submit/declaration',
	getJourneyResponse,
	checkNotSubmitted(dashboardUrl),
	appellantSubmissionDeclaration
);

router.post('/submit/declaration', getJourneyResponse, validationErrorHandler, appellantSubmit);

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
