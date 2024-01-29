const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/common/request-new-code');

const {
	VIEW: {
		FULL_APPEAL: { ENTER_CODE },
		COMMON: { CODE_EXPIRED }
	}
} = require('#lib/views');

const router = express.Router();

router.get('/submit-appeal/code-expired', getRequestNewCode(CODE_EXPIRED));
router.post('/submit-appeal/code-expired', postRequestNewCode(ENTER_CODE));

module.exports = router;
