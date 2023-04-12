const express = require('express');

const {
	getEnterCode,
	postEnterCode
} = require('../../controllers/appeal-householder-decision/enter-code');
const { rules: ruleEnterCode } = require('../../validators/save-and-return/enter-code');
const { rules: idValidationRules } = require('../../validators/common/check-id-is-uuid');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

//this route allows use of old enter code URLS (without id params)
router.get('/enter-code', getEnterCode);

router.get('/enter-code/:id', idValidationRules(), validationErrorHandler, getEnterCode);
router.post('/enter-code/:id', ruleEnterCode(), validationErrorHandler, postEnterCode);

module.exports = router;
