const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const contactPlanningInspectorateController = require('../../controllers/before-you-start/contact-planning-inspectorate');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: contactPlanningInspectorateValidationRules
} = require('../../validators/before-you-start/contact-planning-inspectorate');

const router = express.Router();

router.get(
	'/contact-planning-inspectorate',
	[fetchExistingAppealMiddleware],
	contactPlanningInspectorateController.getContactPlanningInspectorate
);

router.post(
	'/contact-planning-inspectorate',
	[fetchExistingAppealMiddleware],
	contactPlanningInspectorateValidationRules(),
	validationErrorHandler,
	contactPlanningInspectorateController.postContactPlanningInspectorate
);

module.exports = router;
