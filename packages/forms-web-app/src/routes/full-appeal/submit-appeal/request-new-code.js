const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/common/request-new-code');

const {
	VIEW: {
		FULL_APPEAL: { ENTER_CODE },
		COMMON: { REQUEST_NEW_CODE, NEED_NEW_CODE }
	}
} = require('../../../lib/views');

const router = express.Router();

router.get('/submit-appeal/request-new-code', getRequestNewCode(REQUEST_NEW_CODE));
router.post('/submit-appeal/request-new-code', postRequestNewCode(ENTER_CODE));
router.get('/submit-appeal/need-new-code', getRequestNewCode(NEED_NEW_CODE));
router.post('/submit-appeal/need-new-code', postRequestNewCode(ENTER_CODE));

module.exports = router;
