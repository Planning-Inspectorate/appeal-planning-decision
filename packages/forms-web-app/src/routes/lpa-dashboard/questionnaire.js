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

const { getUserFromSession } = require('../../services/user.service');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');

const router = express.Router();

/**
 * @type {import('express').Handler}
 */
const questionnaireTaskList = async (req, res) => {
	const referenceId = res.locals.journeyResponse.referenceId;
	const user = getUserFromSession(req);
	const encodedReferenceId = encodeURIComponent(referenceId);
	const appeal = await req.appealsApiClient.getUsersAppealCase({
		caseReference: encodedReferenceId,
		userId: user.id,
		role: LPA_USER_ROLE
	});

	const pageCaption = `Appeal ${appeal.caseReference}`;

	return list(req, res, pageCaption, { appeal });
};

// list
router.get('/questionnaire/:referenceId', getJourneyResponse(), questionnaireTaskList);

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
