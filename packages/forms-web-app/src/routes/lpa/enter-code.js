const express = require('express');
const { rules: ruleEnterCode } = require('../../validators/lpa/enter-code');
const { rules: idValidationRules } = require('../../validators/common/check-id-is-email-address');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { getEnterCodeLPA, postEnterCodeLPA } = require('../../controllers/common/enter-code');

const {
	VIEW: {
		LPA: { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD }
	}
} = require('../../lib/views');

const views = {
	ENTER_CODE,
	CODE_EXPIRED,
	NEED_NEW_CODE,
	REQUEST_NEW_CODE,
	DASHBOARD
};

const router = express.Router();

router.get('/enter-code/:id', idValidationRules(), validationErrorHandler, getEnterCodeLPA(views));
router.post('/enter-code/:id', ruleEnterCode(), validationErrorHandler, postEnterCodeLPA(views));

module.exports = router;
