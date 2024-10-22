const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		RULE_6: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('#lib/views');

const router = express.Router();

router.get('/code-expired', getRequestNewCode(CODE_EXPIRED));
router.get('/code-expired/:id', getRequestNewCode(CODE_EXPIRED));
router.post('/code-expired', postRequestNewCode(ENTER_CODE));
router.post('/code-expired/:id', postRequestNewCode(ENTER_CODE));

module.exports = router;
