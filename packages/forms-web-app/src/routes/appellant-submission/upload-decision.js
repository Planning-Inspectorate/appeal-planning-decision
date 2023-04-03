const express = require('express');
const { documentTypes } = require('@pins/common');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const uploadDecisionController = require('../../controllers/appellant-submission/upload-decision');
const { rules: fileUploadValidationRules } = require('../../validators/common/file-upload');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const setSectionAndTaskNames = require('../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'requiredDocumentsSection';
const taskName = documentTypes.decisionLetter.name;

router.get(
	'/upload-decision',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	uploadDecisionController.getUploadDecision
);
router.post(
	'/upload-decision',
	setSectionAndTaskNames(sectionName, taskName),
	fileUploadValidationRules('Select a decision letter'),
	validationErrorHandler,
	uploadDecisionController.postUploadDecision
);

module.exports = router;
