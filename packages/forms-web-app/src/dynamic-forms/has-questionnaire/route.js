const express = require('express');
const { list, question, save, remove } = require('../controller');
const validate = require('../validator/validator');
const { validationErrorHandler } = require('../validator/validation-error-handler');
const getAppeal = require('../middleware/get-appeal-for-lpa');
const getJourneyResponse = require('../middleware/get-journey-response');
const dynamicReqFilesToReqBodyFiles = require('../middleware/dynamic-req-files-to-req-body-files');

const router = express.Router();

// list
router.get('/questionnaire/:referenceId', getAppeal(), getJourneyResponse(), list);

// question
router.get(
	'/questionnaire/:referenceId/:section/:question',
	getAppeal(),
	getJourneyResponse(),
	question
);

// save
router.post(
	'/questionnaire/:referenceId/:section/:question',
	getAppeal(),
	getJourneyResponse(),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get(
	'/questionnaire/:referenceId/:section/:question/:answerId',
	getAppeal(),
	getJourneyResponse(),
	remove
);

module.exports = router;
