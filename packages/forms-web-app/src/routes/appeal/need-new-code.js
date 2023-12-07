const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		APPEAL: { ENTER_CODE },
		COMMON: { NEED_NEW_CODE }
	}
} = require('../../lib/views');

const router = express.Router();

router.get('/need-new-code', getRequestNewCode(NEED_NEW_CODE));
router.post('/need-new-code', postRequestNewCode(ENTER_CODE));

module.exports = router;
