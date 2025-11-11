const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const convertMonthNameToNumber = require('../../middleware/convert-month-name-to-number');
const combineDateInputsMiddleware = require('../../middleware/combine-date-inputs');
const enforcementEffectiveDateController = require('../../controllers/before-you-start/enforcement-effective-date');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: enforcementEffectiveDateValidationRules
} = require('../../validators/before-you-start/enforcement-effective-date');

const router = express.Router();

router.get(
	'/enforcement-effective-date',
	[fetchExistingAppealMiddleware],
	enforcementEffectiveDateController.getEnforcementEffectiveDate
);

router.post(
	'/enforcement-effective-date',
	[fetchExistingAppealMiddleware, convertMonthNameToNumber, combineDateInputsMiddleware],
	enforcementEffectiveDateValidationRules(),
	validationErrorHandler,
	enforcementEffectiveDateController.postEnforcementEffectiveDate
);

module.exports = router;
