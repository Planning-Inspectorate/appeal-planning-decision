const express = require('express');
const {
	getPlansDrawings,
	postPlansDrawings
} = require('../../../controllers/full-appeal/submit-appeal/plans-drawings');
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
const taskName = 'plansDrawings';

router.get(
	'/submit-appeal/plans-drawings',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getPlansDrawings
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
	postPlansDrawings
);

module.exports = router;
