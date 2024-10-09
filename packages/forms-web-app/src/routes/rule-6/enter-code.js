// const express = require('express');
// const { rules: ruleEnterCode } = require('../../validators/common/enter-code');
// const { validationErrorHandler } = require('../../validators/validation-error-handler');
// const { getEnterCodeLPA, postEnterCodeLPA } = require('../../controllers/rule-6/enter-code');
// const {
// 	VIEW: {
// 		RULE_6_APPEALS: {
// 			ENTER_CODE,
// 			CODE_EXPIRED,
// 			NEED_NEW_CODE,
// 			REQUEST_NEW_CODE,
// 			DASHBOARD,
// 			EMAIL_ADDRESS
// 		}
// 	}
// } = require('../../lib/views');

// const router = express.Router();

// const views = {
// 	ENTER_CODE,
// 	EMAIL_ADDRESS,
// 	CODE_EXPIRED,
// 	NEED_NEW_CODE,
// 	REQUEST_NEW_CODE,
// 	DASHBOARD
// };

// router.get('/enter-code/:id', validationErrorHandler, getEnterCodeR6(views));
// router.post('/enter-code/:id', ruleEnterCode(), validationErrorHandler, postEnterCodeR6(views));

// module.exports = router;
