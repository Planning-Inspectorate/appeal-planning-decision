const express = require('express');

const { documentTypes } = require('@pins/common');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const appealStatementController = require('../../controllers/appellant-submission/appeal-statement');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: appealStatementValidationRules
} = require('../../validators/common/appeal-statement');
const setSectionAndTaskNames = require('../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'yourAppealSection';
const taskName = documentTypes.appealStatement.name;

router.get(
	'/appeal-statement',
	[fetchExistingAppealMiddleware],
	appealStatementController.getAppealStatement
);
router.post(
	'/appeal-statement',
	setSectionAndTaskNames(sectionName, taskName),
	appealStatementValidationRules(
		'Select an appeal statement',
		'Select to confirm you have not included sensitive information in your appeal statement'
	),
	validationErrorHandler,
	appealStatementController.postAppealStatement
);

module.exports = router;
