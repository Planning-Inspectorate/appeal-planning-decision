const express = require('express');

const { documentTypes } = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { PLANS_DRAWINGS_DOCUMENTS, DESIGN_ACCESS_STATEMENT_SUBMITTED }
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
const documentType = documentTypes.plansDrawingsSupportingDocuments.name;
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentType;

router.get(
	'/submit-appeal/plans-drawings-documents',
	[fetchExistingAppealMiddleware],
	setSectionAndTaskNames(sectionName, taskName),
	getAppealMultiFileUpload(PLANS_DRAWINGS_DOCUMENTS)
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
	postAppealMultiFileUpload(
		PLANS_DRAWINGS_DOCUMENTS,
		DESIGN_ACCESS_STATEMENT_SUBMITTED,
		documentType,
		'plansDrawingsSupportingDocuments'
	)
);

module.exports = router;
