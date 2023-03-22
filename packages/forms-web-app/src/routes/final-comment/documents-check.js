const express = require('express');

const documentsCheckController = require('../../controllers/final-comment/documents-check');

const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../validators/common/options');

const router = express.Router();

router.get('/documents-check', documentsCheckController.getDocumentsCheck);

router.post(
	'/documents-check',
	optionsValidationRules({
		fieldName: 'documents-check',
		emptyError: 'Select yes to upload documents'
	}),
	validationErrorHandler,
	documentsCheckController.postDocumentsCheck
);

module.exports = router;
