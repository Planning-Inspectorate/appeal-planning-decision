const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		FULL_APPEAL: { CODE_EXPIRED },
		LPA_DASHBOARD: { ENTER_CODE }
	}
} = require('../../lib/views');

const router = express.Router();

router.get('/code-expired', getRequestNewCode(CODE_EXPIRED));
router.post('/code-expired', postRequestNewCode(ENTER_CODE));

module.exports = router;
