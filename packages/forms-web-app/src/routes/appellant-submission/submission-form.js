const express = require('express');
const { question, save, remove } = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-appellant');

const router = express.Router();

// question
router.get('/appeals/:appealType/:section/:question', getJourneyResponse, question);

// save
router.post(
	'/appeals/:appealType/:section/:question',
	getJourneyResponse,
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get('/appeals/:appealType/:section/:question/:answerId', getJourneyResponse, remove);

module.exports = router;
