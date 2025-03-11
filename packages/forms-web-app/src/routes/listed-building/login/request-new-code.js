const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/common/request-new-code');

const {
	VIEW: {
		LISTED_BUILDING: { ENTER_CODE },
		COMMON: { REQUEST_NEW_CODE }
	}
} = require('../../../lib/views');

const router = express.Router();

router.get('/request-new-code', getRequestNewCode(REQUEST_NEW_CODE));
router.post('/request-new-code', postRequestNewCode(ENTER_CODE));

module.exports = router;
