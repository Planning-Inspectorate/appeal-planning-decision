const express = require('express');
const { documentsUploadGet, documentsUploaddPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const {
	rules: multifileUploadValidationRules
} = require('../../../../validators/common/multifile-upload.js');
const {
	rules: checkDocumentUploadedValidationRules
} = require('../../../../validators/common/check-document-uploaded');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const checkInterestedPartySessionActive = require('../../../../middleware/interested-parties/check-ip-session-set');
const reqFilesToReqBodyFilesMiddleware = require('../../../../middleware/req-files-to-req-body-files');

const router = express.Router();

router.get('/', checkInterestedPartySessionActive, asyncHandler(documentsUploadGet));
router.post(
	'/',
	checkInterestedPartySessionActive,
	[
		reqFilesToReqBodyFilesMiddleware('supporting-documents'),
		checkDocumentUploadedValidationRules(
			'supporting-documents',
			'uploadedFiles',
			'interestedParty',
			'Select a supporting document'
		),
		multifileUploadValidationRules('files.supporting-documents.*')
	],
	validationErrorHandler,
	asyncHandler(documentsUploaddPost)
);

module.exports = { router };
