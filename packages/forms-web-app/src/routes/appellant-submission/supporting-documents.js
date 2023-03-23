const express = require('express');

const supportingDocumentsController = require('../../controllers/appellant-submission/supporting-documents');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const reqFilesToReqBodyFilesMiddleware = require('../../middleware/req-files-to-req-body-files');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: multifileUploadValidationRules
} = require('../../validators/common/multifile-upload');

const router = express.Router();

router.get(
	'/supporting-documents',
	[fetchExistingAppealMiddleware],
	supportingDocumentsController.getSupportingDocuments
);
router.post(
	'/supporting-documents',
	[
		reqFilesToReqBodyFilesMiddleware('supporting-documents'),
		multifileUploadValidationRules('files.supporting-documents.*')
	],
	validationErrorHandler,
	supportingDocumentsController.postSupportingDocuments
);

module.exports = router;
