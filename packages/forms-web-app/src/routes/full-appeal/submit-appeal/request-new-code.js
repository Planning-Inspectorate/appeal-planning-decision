const express = require('express');

const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../controllers/common/request-new-code');

const {
	VIEW: {
		FULL_APPEAL: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../../lib/full-appeal/views');

const views = { REQUEST_NEW_CODE, ENTER_CODE };

const router = express.Router();

router.get('/submit-appeal/request-new-code', getRequestNewCode(views));
router.post('/submit-appeal/request-new-code', postRequestNewCode(views));

module.exports = router;
