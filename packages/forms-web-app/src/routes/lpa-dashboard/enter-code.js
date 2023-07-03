const express = require('express');
const { rules: ruleEnterCode } = require('../../validators/common/enter-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { getEnterCodeLPA, postEnterCodeLPA } = require('../../controllers/common/enter-code');
const {
	VIEW: {
		LPA_DASHBOARD: {
			ENTER_CODE,
			CODE_EXPIRED,
			NEED_NEW_CODE,
			REQUEST_NEW_CODE,
			DASHBOARD,
			ENTER_EMAIL
		}
	}
} = require('../../lib/views');

const router = express.Router();

const views = {
	ENTER_CODE,
	ENTER_EMAIL,
	CODE_EXPIRED,
	NEED_NEW_CODE,
	REQUEST_NEW_CODE,
	DASHBOARD
};

router.get('/enter-code/:id', validationErrorHandler, getEnterCodeLPA(views));
router.post('/enter-code/:id', ruleEnterCode(), validationErrorHandler, postEnterCodeLPA(views));

module.exports = router;
