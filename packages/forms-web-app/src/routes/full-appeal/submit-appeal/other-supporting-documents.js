const express = require('express');
const {
	getOtherSupportingDocuments,
	postOtherSupportingDocuments
} = require('../../../controllers/full-appeal/submit-appeal/other-supporting-documents');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: multifileUploadValidationRules
} = require('../../../validators/common/multifile-upload');
const {
	rules: checkDocumentUploadedValidationRules
} = require('../../../validators/common/check-document-uploaded');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');
const reqFilesToReqBodyFilesMiddleware = require('../../../middleware/req-files-to-req-body-files');

const router = express.Router();
const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

router.get(
	'/submit-appeal/other-supporting-documents',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getOtherSupportingDocuments
);
router.post(
	'/submit-appeal/other-supporting-documents',
	setSectionAndTaskNames(sectionName, taskName),
	[
		reqFilesToReqBodyFilesMiddleware('file-upload'),
		checkDocumentUploadedValidationRules(
			'file-upload',
			taskName,
			'appeal',
			'Select a supporting document'
		),
		multifileUploadValidationRules('files.file-upload.*')
	],
	validationErrorHandler,
	postOtherSupportingDocuments
);

module.exports = router;
