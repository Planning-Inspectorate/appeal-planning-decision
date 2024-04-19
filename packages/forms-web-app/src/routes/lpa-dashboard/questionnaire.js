const express = require('express');
const {
	list,
	question,
	save,
	remove,
	submit,
	lpaSubmitted
} = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const getJourneyResponse = require('../../dynamic-forms/middleware/get-journey-response-for-lpa');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');

const router = express.Router();

// list
router.get('/questionnaire/:referenceId', getJourneyResponse(), list);

// question
router.get('/questionnaire/:referenceId/:section/:question', getJourneyResponse(), question);

// save
router.post(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// submit
router.post('/questionnaire/:referenceId/', getJourneyResponse(), validationErrorHandler, submit);

router.get(
	'/full-planning/:referenceId/questionnaire-submitted',
	getJourneyResponse(),
	validationErrorHandler,
	lpaSubmitted
);

router.get(
	'/householder/:referenceId/questionnaire-submitted',
	getJourneyResponse(),
	validationErrorHandler,
	lpaSubmitted
);

// remove answer - only available for some question types
router.get(
	'/questionnaire/:referenceId/:section/:question/:answerId',
	getJourneyResponse(),
	remove
);

module.exports = router;
