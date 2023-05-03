const express = require('express');

const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { DRAFT_PLANNING_OBLIGATION, NEW_DOCUMENTS }
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
	getAppealMultiFileUpload,
	postAppealMultiFileUpload
} = require('../../../controllers/common/appeal-multi-file-upload');
const setSectionAndTaskNames = require('../../../middleware/set-section-and-task-names');
const reqFilesToReqBodyFilesMiddleware = require('../../../middleware/req-files-to-req-body-files');

const router = express.Router();
const documentType = documentTypes.draftPlanningObligations.name;
const sectionName = 'appealDocumentsSection';
const taskName = 'draftPlanningObligations';

router.get(
	'/submit-appeal/draft-planning-obligation',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getAppealMultiFileUpload(DRAFT_PLANNING_OBLIGATION)
);
router.post(
	'/submit-appeal/draft-planning-obligation',
	setSectionAndTaskNames(sectionName, taskName),
	[
		reqFilesToReqBodyFilesMiddleware('file-upload'),
		checkDocumentUploadedValidationRules(
			'file-upload',
			taskName,
			'appeal',
			'Select your draft planning obligation'
		),
		multifileUploadValidationRules('files.file-upload.*')
	],
	validationErrorHandler,
	postAppealMultiFileUpload(
		DRAFT_PLANNING_OBLIGATION,
		NEW_DOCUMENTS,
		documentType,
		'draftPlanningObligations',
		'DRAFT PLANNING OBLIGATION'
	)
);

module.exports = router;
