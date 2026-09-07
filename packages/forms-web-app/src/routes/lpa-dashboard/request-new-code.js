const express = require('express');
const {
	getRequestNewCodeLPA,
	postRequestNewCodeLPA
} = require('../../controllers/common/request-new-code');

const router = express.Router();

const {
	VIEW: {
		LPA_DASHBOARD: { ENTER_CODE, REQUEST_NEW_CODE }
	}
} = require('../../lib/views');

router.get('/request-new-code', getRequestNewCodeLPA(REQUEST_NEW_CODE));
router.post('/request-new-code', postRequestNewCodeLPA(ENTER_CODE));

module.exports = router;
