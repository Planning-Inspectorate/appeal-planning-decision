const express = require('express');

const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { PLANNING_OBLIGATION, NEW_DOCUMENTS }
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
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');
const reqFilesToReqBodyFilesMiddleware = require('../../../middleware/req-files-to-req-body-files');
const {
	getAppealMultiFileUpload,
	postAppealMultiFileUpload
} = require('../../../controllers/common/appeal-multi-file-upload');

const router = express.Router();
const documentType = documentTypes.planningObligations.name;
const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

router.get(
	'/submit-appeal/planning-obligation',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getAppealMultiFileUpload(PLANNING_OBLIGATION)
);
router.post(
	'/submit-appeal/planning-obligation',
	setSectionAndTaskNames(sectionName, taskName),
	[
		reqFilesToReqBodyFilesMiddleware('file-upload'),
		checkDocumentUploadedValidationRules(
			'file-upload',
			taskName,
			'appeal',
			'Select your planning obligation'
		),
		multifileUploadValidationRules('files.file-upload.*')
	],
	validationErrorHandler,
	postAppealMultiFileUpload(
		PLANNING_OBLIGATION,
		NEW_DOCUMENTS,
		documentType,
		'planningObligationDocuments',
		'PLANNING OBLIGATION'
	)
);

module.exports = router;
