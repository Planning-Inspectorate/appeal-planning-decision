const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const convertMonthNameToNumber = require('../../middleware/convert-month-name-to-number');
const combineDateInputsMiddleware = require('../../middleware/combine-date-inputs');
const contactPlanningInspectorateDateController = require('../../controllers/before-you-start/contact-planning-inspectorate-date');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: contactPlanningInspectorateValidationRules
} = require('../../validators/before-you-start/contact-planning-inspectorate-date');

const router = express.Router();

router.get(
	'/contact-planning-inspectorate-date',
	[fetchExistingAppealMiddleware],
	contactPlanningInspectorateDateController.getContactPlanningInspectorateDate
);

router.post(
	'/contact-planning-inspectorate-date',
	[fetchExistingAppealMiddleware, convertMonthNameToNumber, combineDateInputsMiddleware],
	contactPlanningInspectorateValidationRules(),
	validationErrorHandler,
	contactPlanningInspectorateDateController.postContactPlanningInspectorateDate
);

module.exports = router;
