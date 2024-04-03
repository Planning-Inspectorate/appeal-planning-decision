const express = require('express');
const { question, save, remove } = require('../../dynamic-forms/controller');
const validate = require('../../dynamic-forms/validator/validator');
const {
	validationErrorHandler
} = require('../../dynamic-forms/validator/validation-error-handler');
const dynamicReqFilesToReqBodyFiles = require('../../dynamic-forms/middleware/dynamic-req-files-to-req-body-files');

const router = express.Router();

// question
router.get(
	'/appeals/householder/:question',
	// add new journey response middleware
	question
);

// save
router.post(
	'/appeals/householder/:question',
	// add new journey response middleware
	dynamicReqFilesToReqBodyFiles(),
	validate(),
	validationErrorHandler,
	save
);

// remove answer - only available for some question types
router.get(
	'/appeals/householder/:question/:answerId',
	// add new journey response middleware
	remove
);
