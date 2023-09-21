const express = require('express');
const { list, question, save, remove } = require('../controller');
const { JOURNEY_TYPES } = require('../journey-factory');
const validate = require('../validator/validator');
const { validationErrorHandler } = require('../validator/validation-error-handler');
const getJourneyResponse = require('../middleware/get-journey-response');
const dynamicReqFilesToReqBodyFiles = require('../middleware/dynamic-req-files-to-req-body-files');

const router = express.Router();

// list
router.get(
	'/questionnaire/:referenceId',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	list
);

// question
router.get(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	question
);

// save
router.post(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get(
	'/questionnaire/:referenceId/:section/:question/:answerId',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	remove
);

module.exports = router;
