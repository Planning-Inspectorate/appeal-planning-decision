const express = require('express');

const {
	getEnterCode,
	postEnterCode
} = require('../../controllers/appeal-householder-decision/enter-code');
const { rules: ruleEnterCode } = require('../../validators/appeal-householder-decision/enter-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/enter-code', getEnterCode);

router.post('/enter-code', ruleEnterCode(), validationErrorHandler, postEnterCode);

module.exports = router;
