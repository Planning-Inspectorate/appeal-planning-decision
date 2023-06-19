const express = require('express');
const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../controllers/common/request-new-code');

const router = express.Router();

const {
	VIEW: {
		FINAL_COMMENT: { NEED_NEW_CODE, INPUT_CODE }
	}
} = require('../../lib/views');

router.get('/need-new-code', getRequestNewCode(NEED_NEW_CODE));
router.post('/need-new-code', postRequestNewCode(INPUT_CODE));

module.exports = router;
