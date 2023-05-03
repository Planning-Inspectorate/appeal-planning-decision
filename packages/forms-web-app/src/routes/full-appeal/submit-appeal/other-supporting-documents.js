const express = require('express');

const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { OTHER_SUPPORTING_DOCUMENTS, TASK_LIST }
	}
} = require('../../../lib/full-appeal/views');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: multifileUploadValidationRules
} = require('../../../validators/common/multifile-upload');
const {
	rules: checkDocumentUploadedValidationRules
} = require('../../../validators/common/check-document-uploaded');
const {
	postAppealMultiFileUpload,
	getAppealMultiFileUpload
} = require('../../../controllers/common/appeal-multi-file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');
const reqFilesToReqBodyFilesMiddleware = require('../../../middleware/req-files-to-req-body-files');

const router = express.Router();
const documentType = documentTypes.otherDocuments.name;
const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

router.get(
	'/submit-appeal/other-supporting-documents',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getAppealMultiFileUpload(OTHER_SUPPORTING_DOCUMENTS)
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
	postAppealMultiFileUpload(
		OTHER_SUPPORTING_DOCUMENTS,
		TASK_LIST,
		documentType,
		'newSupportingDocuments',
		'CORRESPONDENCE WITH LPA'
	)
);

module.exports = router;
