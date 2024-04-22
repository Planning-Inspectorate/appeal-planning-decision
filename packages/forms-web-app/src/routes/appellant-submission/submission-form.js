const express = require('express');
const {
	question,
	save,
	remove,
	appellantSubmissionDeclaration,
	appellantSubmitted
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-appellant');

const router = express.Router();

router.get('/submit/declaration', getJourneyResponse, appellantSubmissionDeclaration);

router.get('/submit/submitted', getJourneyResponse, validationErrorHandler, appellantSubmitted);

// question
router.get('/:section/:question', getJourneyResponse, question);

// save
router.post(
	'/:section/:question',
	getJourneyResponse,
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get('/:section/:question/:answerId', getJourneyResponse, remove);

module.exports = router;
