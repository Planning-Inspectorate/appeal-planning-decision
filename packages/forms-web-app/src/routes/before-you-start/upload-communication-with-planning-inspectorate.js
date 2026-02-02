const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementNoticeListedBuildingController = require('../../controllers/before-you-start/upload-communication-with-planning-inspectorate');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const reqFilesToReqBodyFilesMiddleware = require('../../middleware/req-files-to-req-body-files');
const {
	rules: multifileUploadValidationRules
} = require('../../validators/common/multifile-upload');
const router = express.Router();

router.get(
	'/enforcement/upload-documents/upload-planning-inspectorate-communication',
	[fetchExistingAppealMiddleware],
	enforcementNoticeListedBuildingController.getUploadCommunicationWithPlanningInspectorate
);
router.post(
	'/enforcement/upload-documents/upload-planning-inspectorate-communication',
	[
		fetchExistingAppealMiddleware,
		reqFilesToReqBodyFilesMiddleware('communication-with-planning-inspectorate'),
		multifileUploadValidationRules('files.communication-with-planning-inspectorate.*')
	],
	validationErrorHandler,
	enforcementNoticeListedBuildingController.postUploadCommunicationWithPlanningInspectorate
);

module.exports = router;
