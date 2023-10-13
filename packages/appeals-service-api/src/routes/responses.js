const express = require('express');
const {
	patchResponseByReferenceId,
	getResponseByReferenceId,
	submitQuestionnaireResponse
} = require('../controllers/responses');
const router = express.Router();

router.patch('/:journeyId/:referenceId/:lpaCode', patchResponseByReferenceId);
router.get('/:journeyId/:referenceId/:projection?', getResponseByReferenceId);
router.post('/:journeyId/:referenceId/', submitQuestionnaireResponse);

module.exports = router;
