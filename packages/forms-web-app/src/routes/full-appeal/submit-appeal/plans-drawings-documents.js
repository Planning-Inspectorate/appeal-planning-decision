const { documentTypes } = require('@pins/common');
const express = require('express');
const {
	getPlansDrawingsDocuments,
	postPlansDrawingsDocuments
} = require('../../../controllers/full-appeal/submit-appeal/plans-drawings-documents');
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
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.plansDrawingsSupportingDocuments.name;

router.get(
	'/submit-appeal/plans-drawings-documents',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getPlansDrawingsDocuments
);
router.post(
	'/submit-appeal/plans-drawings-documents',
	setSectionAndTaskNames(sectionName, taskName),
	[
		reqFilesToReqBodyFilesMiddleware('file-upload'),
		checkDocumentUploadedValidationRules(
			'file-upload',
			taskName,
			'appeal',
			'Select your plans, drawings and supporting documents'
		),
		multifileUploadValidationRules('files.file-upload.*')
	],
	validationErrorHandler,
	postPlansDrawingsDocuments
);

module.exports = router;
