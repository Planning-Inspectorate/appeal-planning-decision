const express = require('express');
const { getNeedNewCode, postNeedNewCode } = require('../../controllers/common/need-new-code');

const router = express.Router();

const {
	VIEW: {
		RULE_6: { NEED_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const needViews = { NEED_NEW_CODE, ENTER_CODE };

router.get('/need-new-code/:id', getNeedNewCode(needViews));
router.post('/need-new-code/:id', postNeedNewCode(needViews));

module.exports = router;
