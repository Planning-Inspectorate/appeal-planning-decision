const express = require('express');

const { rules: ruleEnterCode } = require('../../validators/common/enter-code');
const { rules: idValidationRules } = require('../../validators/common/check-id-is-uuid');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { getEnterCode, postEnterCode } = require('../../controllers/common/enter-code');

const {
	VIEW: {
		APPELLANT_SUBMISSION: {
			TASK_LIST,
			ENTER_CODE,
			REQUEST_NEW_CODE,
			CODE_EXPIRED,
			NEED_NEW_CODE,
			APPEAL_ALREADY_SUBMITTED,
			EMAIL_CONFIRMED,
			EMAIL_ADDRESS
		}
	}
} = require('../../lib/views');

const views = {
	TASK_LIST,
	ENTER_CODE,
	REQUEST_NEW_CODE,
	CODE_EXPIRED,
	NEED_NEW_CODE,
	APPEAL_ALREADY_SUBMITTED,
	EMAIL_CONFIRMED,
	EMAIL_ADDRESS
};

const router = express.Router();

//this route allows use of old enter code URLS (without id params)
router.get('/enter-code', getEnterCode(views));

router.get('/enter-code/:id', idValidationRules(), validationErrorHandler, getEnterCode(views));
router.post('/enter-code/:id', ruleEnterCode(), validationErrorHandler, postEnterCode(views));

module.exports = router;
