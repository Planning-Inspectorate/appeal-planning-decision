const express = require('express');

const {
	getRequestNewCodeLPA,
	postRequestNewCodeLPA
} = require('../../controllers/common/request-new-code');

const {
	VIEW: {
		LPA_DASHBOARD: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('../../lib/views');

const router = express.Router();

router.get('/code-expired', getRequestNewCodeLPA(CODE_EXPIRED));
router.post('/code-expired', postRequestNewCodeLPA(ENTER_CODE));

module.exports = router;
