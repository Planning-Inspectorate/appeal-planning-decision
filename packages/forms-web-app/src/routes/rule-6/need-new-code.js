const express = require('express');
const { getNeedNewCode, postNeedNewCodeRule6 } = require('../../controllers/common/need-new-code');

const router = express.Router();

const {
	VIEW: {
		RULE_6: { NEED_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const needViews = { NEED_NEW_CODE, ENTER_CODE };

router.get('/need-new-code', getNeedNewCode(needViews));
router.post('/need-new-code', postNeedNewCodeRule6(needViews));

module.exports = router;
