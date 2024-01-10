const express = require('express');

const { rules: ruleEnterCode } = require('../../validators/common/enter-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { getEnterCode, postEnterCode } = require('../../controllers/common/enter-code');

const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, APPEAL_ALREADY_SUBMITTED, EMAIL_CONFIRMED },
		APPEAL: { EMAIL_ADDRESS, REQUEST_NEW_CODE, CODE_EXPIRED, NEED_NEW_CODE, ENTER_CODE },
		APPEALS: { YOUR_APPEALS },
		COMMON
	}
} = require('../../lib/views');

const views = {
	TASK_LIST,
	ENTER_CODE_URL: ENTER_CODE,
	REQUEST_NEW_CODE,
	CODE_EXPIRED,
	NEED_NEW_CODE,
	APPEAL_ALREADY_SUBMITTED,
	EMAIL_CONFIRMED,
	EMAIL_ADDRESS,
	YOUR_APPEALS,
	ENTER_CODE: COMMON.ENTER_CODE
};

const router = express.Router();

router.get('/enter-code', getEnterCode(views, true));

router.post('/enter-code', ruleEnterCode(), validationErrorHandler, postEnterCode(views, true));

module.exports = router;
