const express = require('express');

const {
	getEnterCode,
	postEnterCode
} = require('../../controllers/appeal-householder-decision/enter-code');
const { rules: ruleEnterCode } = require('../../validators/save-and-return/enter-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/enter-code/:id', [fetchExistingAppealMiddleware], getEnterCode);

router.post('/enter-code/:id', ruleEnterCode(), validationErrorHandler, postEnterCode);

module.exports = router;
