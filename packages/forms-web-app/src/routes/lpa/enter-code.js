const express = require('express');
const { rules: ruleEnterCode } = require('../../validators/lpa/enter-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { getEnterCodeLPA, postEnterCodeLPA } = require('../../controllers/common/enter-code');

const {
	VIEW: {
		LPA: { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE }
	}
} = require('../../lib/views');

const views = {
	ENTER_CODE,
	CODE_EXPIRED,
	NEED_NEW_CODE
};

const router = express.Router();

router.get('/enter-code', getEnterCodeLPA(views));
router.post('/enter-code', ruleEnterCode(), validationErrorHandler, postEnterCodeLPA(views));

module.exports = router;
