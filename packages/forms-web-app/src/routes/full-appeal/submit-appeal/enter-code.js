const express = require('express');

const {
	getEnterCode,
	postEnterCode
} = require('../../../controllers/full-appeal/submit-appeal/enter-code');
const { rules: ruleEnterCode } = require('../../../validators/save-and-return/enter-code');
const { rules: idValidationRules } = require('../../../validators/common/check-id-is-uuid');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

//this route allows use of old enter code URLS (without id params)
router.get('/submit-appeal/enter-code', getEnterCode);

router.get(
	'/submit-appeal/enter-code/:id',
	idValidationRules(),
	validationErrorHandler,
	getEnterCode
);

router.post(
	'/submit-appeal/enter-code/:id',
	ruleEnterCode(),
	validationErrorHandler,
	postEnterCode
);

module.exports = router;
