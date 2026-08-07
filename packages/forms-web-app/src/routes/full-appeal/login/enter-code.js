const express = require('express');

const { rules: ruleEnterCode } = require('../../../validators/common/enter-code');
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
		APPEALS: { YOUR_APPEALS },
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
	YOUR_APPEALS,
	ENTER_CODE: COMMON.ENTER_CODE
};

const router = express.Router();

router.get(
	'/submit-appeal/enter-code/:enterCodeId',
	/** @type {import('express').RequestHandler} */
	(_, res) => {
		return res.redirect(`/${views.YOUR_APPEALS}`);
	}
);

router.get('/submit-appeal/enter-code', validationErrorHandler, getEnterCode(views));

router.post(
	'/submit-appeal/enter-code',
	ruleEnterCode(),
	validationErrorHandler,
	postEnterCode(views, { isGeneralLogin: false })
);

module.exports = router;
