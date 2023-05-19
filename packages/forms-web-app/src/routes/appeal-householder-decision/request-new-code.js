const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, NEED_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const requestViews = { REQUEST_NEW_CODE, ENTER_CODE };
const needViews = { REQUEST_NEW_CODE: NEED_NEW_CODE, ENTER_CODE };

const router = express.Router();

router.get('/request-new-code', getRequestNewCode(requestViews));
router.post('/request-new-code', postRequestNewCode(requestViews));
router.get('/need-new-code', getRequestNewCode(needViews));
router.post('/need-new-code', postRequestNewCode(needViews));

module.exports = router;
