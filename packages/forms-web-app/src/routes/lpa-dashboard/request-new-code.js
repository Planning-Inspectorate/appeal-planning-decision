const express = require('express');
const {
	getRequestNewCodeLPA,
	postRequestNewCodeLPA
} = require('../../controllers/common/request-new-code');

const router = express.Router();

const {
	VIEW: {
		LPA_DASHBOARD: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const requestViews = { REQUEST_NEW_CODE, ENTER_CODE };

router.get('/request-new-code', getRequestNewCodeLPA(requestViews));
router.post('/request-new-code', postRequestNewCodeLPA(requestViews));

module.exports = router;
