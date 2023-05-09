const express = require('express');

const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { PLANS_DRAWINGS, PLANNING_OBLIGATION_PLANNED }
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
const documentType = documentTypes.decisionPlans.name;
const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';

router.get(
	'/submit-appeal/plans-drawings',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getAppealMultiFileUpload(PLANS_DRAWINGS)
);
router.post(
	'/submit-appeal/plans-drawings',
	setSectionAndTaskNames(sectionName, taskName),
	[
		reqFilesToReqBodyFilesMiddleware('file-upload'),
		checkDocumentUploadedValidationRules(
			'file-upload',
			taskName,
			'appeal',
			'Select a plan or drawing'
		),
		multifileUploadValidationRules('files.file-upload.*')
	],
	validationErrorHandler,
	postAppealMultiFileUpload(
		PLANS_DRAWINGS,
		PLANNING_OBLIGATION_PLANNED,
		documentType,
		'plansDrawings',
		'LIST OF PLANS SUBMITTED AFTER LPA DECISION'
	)
);

module.exports = router;
