const express = require('express');

const { rules: ruleEnterCode } = require('../../../validators/common/enter-code');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { getEnterCode, postEnterCode } = require('../../../controllers/common/enter-code');

const {
	VIEW: {
		ENFORCEMENT: { REQUEST_NEW_CODE, CODE_EXPIRED, NEED_NEW_CODE, EMAIL_CONFIRMED, EMAIL_ADDRESS },
		COMMON: { ENTER_CODE }
	}
} = require('../../../lib/views');

const views = {
	REQUEST_NEW_CODE, // url for redirecting
	CODE_EXPIRED, // url for redirecting if token expired
	NEED_NEW_CODE, // url for redirecting if too many attempts
	EMAIL_CONFIRMED, // url for redirecting
	EMAIL_ADDRESS, // url for redirecting
	ENTER_CODE // nunjucks page for rendering
};

const router = express.Router();

router.get('/enter-code', validationErrorHandler, getEnterCode(views));

router.post(
	'/enter-code',
	ruleEnterCode(),
	validationErrorHandler,
	postEnterCode(views, { isGeneralLogin: false })
);

module.exports = router;
