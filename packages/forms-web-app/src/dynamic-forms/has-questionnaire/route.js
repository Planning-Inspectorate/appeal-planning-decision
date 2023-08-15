const express = require('express');
const { list, question, save } = require('../controller');
// const {validate} = require('../validator/validator')
// const { validationErrorHandler } = require('../validator/validation-error-handler');

const router = express.Router();

// task list
router.get('/questionnaire/:caseRef', list);

router.get('/questionnaire/:caseRef/:section/:question', question);
router.post(
	'/questionnaire/:caseRef/:section/:question',
	// validate(),
	// validationErrorHandler,
	save
);

module.exports = router;
