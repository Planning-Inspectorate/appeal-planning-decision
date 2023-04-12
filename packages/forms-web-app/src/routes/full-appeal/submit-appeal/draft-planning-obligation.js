const express = require('express');
const {
	getDraftPlanningObligation,
	postDraftPlanningObligation
} = require('../../../controllers/full-appeal/submit-appeal/draft-planning-obligation');
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
const taskName = 'draftPlanningObligations';

router.get(
	'/submit-appeal/draft-planning-obligation',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getDraftPlanningObligation
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
	postDraftPlanningObligation
);

module.exports = router;
