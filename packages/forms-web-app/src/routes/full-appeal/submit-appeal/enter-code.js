const express = require('express');

const { rules: ruleEnterCode } = require('../../../validators/save-and-return/enter-code');
const { rules: idValidationRules } = require('../../../validators/common/check-id-is-uuid');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { getEnterCode, postEnterCode } = require('../../../controllers/common/enter-code');

const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, REQUEST_NEW_CODE, CODE_EXPIRED, APPEAL_ALREADY_SUBMITTED }
	}
} = require('../../../lib/full-appeal/views');

const views = { TASK_LIST, ENTER_CODE, REQUEST_NEW_CODE, CODE_EXPIRED, APPEAL_ALREADY_SUBMITTED };

const router = express.Router();

//this route allows use of old enter code URLS (without id params)
router.get('/submit-appeal/enter-code', getEnterCode(views));

router.get(
	'/submit-appeal/enter-code/:id',
	idValidationRules(),
	validationErrorHandler,
	getEnterCode(views)
);

router.post(
	'/submit-appeal/enter-code/:id',
	ruleEnterCode(),
	validationErrorHandler,
	postEnterCode(views)
);

module.exports = router;
