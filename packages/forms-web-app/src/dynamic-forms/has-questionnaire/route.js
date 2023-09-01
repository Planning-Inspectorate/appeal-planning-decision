const express = require('express');
const { list, question, save } = require('../controller');
const { JOURNEY_TYPES } = require('../journey-factory');
const validate = require('../validator/validator');
const { validationErrorHandler } = require('../validator/validation-error-handler');
const getJourneyResponse = require('../middleware/get-journey-response');

const router = express.Router();

// list
router.get(
	'/questionnaire/:referenceId',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	async (req, res) => {
		return list(req, res, JOURNEY_TYPES.HAS_QUESTIONNAIRE);
	}
);

// question
router.get(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	async (req, res) => {
		return question(req, res, JOURNEY_TYPES.HAS_QUESTIONNAIRE);
	}
);

router.post(
	'/questionnaire/:referenceId/:section/:question',
	getJourneyResponse(JOURNEY_TYPES.HAS_QUESTIONNAIRE),
	validate(),
	validationErrorHandler,
	async (req, res) => {
		return save(req, res, JOURNEY_TYPES.HAS_QUESTIONNAIRE);
	}
);

module.exports = router;
