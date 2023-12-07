const express = require('express');

const { rules: ruleEnterCode } = require('../../../validators/common/enter-code');
const { rules: idValidationRules } = require('../../../validators/common/check-id-is-uuid');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { getEnterCode, postEnterCode } = require('../../../controllers/common/enter-code');

const {
	VIEW: {
		FULL_APPEAL: {
			TASK_LIST,
			ENTER_CODE,
			REQUEST_NEW_CODE,
			CODE_EXPIRED,
			NEED_NEW_CODE,
			APPEAL_ALREADY_SUBMITTED,
			EMAIL_CONFIRMED,
			EMAIL_ADDRESS
		},
		COMMON
	}
} = require('../../../lib/views');

const views = {
	TASK_LIST,
	ENTER_CODE_URL: ENTER_CODE,
	REQUEST_NEW_CODE,
	CODE_EXPIRED,
	NEED_NEW_CODE,
	APPEAL_ALREADY_SUBMITTED,
	EMAIL_CONFIRMED,
	EMAIL_ADDRESS,
	ENTER_CODE: COMMON.ENTER_CODE
};

const router = express.Router();

//this route allows use of old enter code URLS (without id params)
router.get('/submit-appeal/enter-code', getEnterCode(views, true));

router.get(
	'/submit-appeal/enter-code/:id',
	idValidationRules(),
	validationErrorHandler,
	getEnterCode(views, true)
);

router.post(
	'/submit-appeal/enter-code/:id',
	ruleEnterCode(),
	validationErrorHandler,
	postEnterCode(views, true)
);

module.exports = router;
