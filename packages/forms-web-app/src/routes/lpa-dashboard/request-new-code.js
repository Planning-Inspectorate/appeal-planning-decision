const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		LPA_DASHBOARD: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const requestViews = { REQUEST_NEW_CODE, ENTER_CODE };

const router = express.Router();

router.get('/request-new-code', getRequestNewCode(requestViews));
router.post('/request-new-code', postRequestNewCode(requestViews));

module.exports = router;
