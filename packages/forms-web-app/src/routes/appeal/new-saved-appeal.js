const express = require('express');
const newOrSavedAppealController = require('../../controllers/appeal/new-saved-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../validators/common/options');
const {
	constants: { NEW_OR_SAVED_APPEAL_OPTION }
} = require('@pins/business-rules');

const router = express.Router();

router.get('/new-saved-appeal', newOrSavedAppealController.get);
router.post(
	'/new-saved-appeal',
	optionsValidationRules({
		fieldName: 'new-or-saved-appeal',
		validOptions: Object.values(NEW_OR_SAVED_APPEAL_OPTION),
		emptyError: 'Select if you want to start a new appeal or return to a saved appeal'
	}),
	validationErrorHandler,
	newOrSavedAppealController.post
);

router.get('/start-new', newOrSavedAppealController.startNew);

module.exports = router;
