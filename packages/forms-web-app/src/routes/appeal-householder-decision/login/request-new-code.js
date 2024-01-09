const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/common/request-new-code');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, NEED_NEW_CODE, ENTER_CODE }
	}
} = require('#lib/views');

const router = express.Router();

router.get('/request-new-code', getRequestNewCode(REQUEST_NEW_CODE));
router.post('/request-new-code', postRequestNewCode(ENTER_CODE));
router.get('/need-new-code', getRequestNewCode(NEED_NEW_CODE));
router.post('/need-new-code', postRequestNewCode(ENTER_CODE));

module.exports = router;
