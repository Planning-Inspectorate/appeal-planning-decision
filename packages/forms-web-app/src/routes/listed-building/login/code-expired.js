const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/common/request-new-code');

const {
	VIEW: {
		LISTED_BUILDING: { ENTER_CODE },
		COMMON: { CODE_EXPIRED }
	}
} = require('#lib/views');

const router = express.Router();

router.get('/code-expired', getRequestNewCode(CODE_EXPIRED));
router.post('/code-expired', postRequestNewCode(ENTER_CODE));

module.exports = router;
