const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const views = { REQUEST_NEW_CODE, ENTER_CODE };

const router = express.Router();

router.get('/request-new-code', getRequestNewCode(views));
router.post('/request-new-code', postRequestNewCode(views));

module.exports = router;
