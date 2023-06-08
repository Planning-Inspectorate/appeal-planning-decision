const express = require('express');

const uploadDocumentsController = require('../../controllers/final-comment/upload-documents');
const reqFilesToReqBodyFilesMiddleware = require('../../middleware/req-files-to-req-body-files');
const {
	rules: checkDocumentUploadedValidationRules
} = require('../../validators/common/check-document-uploaded');

const {
	rules: multifileUploadValidationRules
} = require('../../validators/common/multifile-upload');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/upload-documents', uploadDocumentsController.getUploadDocuments);
router.post(
	'/upload-documents',
	[
		reqFilesToReqBodyFilesMiddleware('upload-documents'),
		checkDocumentUploadedValidationRules(
			'upload-documents',
			'supportingDocuments',
			'finalComment',
			'Select the documents to support your appeal'
		),
		multifileUploadValidationRules('files.upload-documents.*')
	],
	validationErrorHandler,
	uploadDocumentsController.postUploadDocuments
);

module.exports = router;
