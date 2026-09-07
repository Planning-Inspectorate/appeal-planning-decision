const express = require('express');

const { getNeedNewCode, postNeedNewCode } = require('../../../controllers/common/need-new-code');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('#lib/views');

const router = express.Router();

router.get('/code-expired', getNeedNewCode(CODE_EXPIRED));
router.post('/code-expired', postNeedNewCode(ENTER_CODE));

module.exports = router;
