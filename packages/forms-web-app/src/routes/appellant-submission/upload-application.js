const express = require('express');
const { documentTypes } = require('@pins/common');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const uploadApplicationController = require('../../controllers/appellant-submission/upload-application');

const { rules: fileUploadValidationRules } = require('../../validators/common/file-upload');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const setSectionAndTaskNames = require('../../middleware/set-section-and-task-names');

const router = express.Router();
const sectionName = 'requiredDocumentsSection';
const taskName = documentTypes.originalApplication.name;

router.get(
	'/upload-application',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	uploadApplicationController.getUploadApplication
);
router.post(
	'/upload-application',
	setSectionAndTaskNames(sectionName, taskName),
	fileUploadValidationRules('Select a planning application form'),
	validationErrorHandler,
	uploadApplicationController.postUploadApplication
);

module.exports = router;
