const express = require('express');
const { getNeedNewCode, postNeedNewCodeLPA } = require('../../controllers/common/need-new-code');

const router = express.Router();

const {
	VIEW: {
		LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const needViews = { NEED_NEW_CODE, ENTER_CODE };

router.get('/need-new-code', getNeedNewCode(needViews));
router.post('/need-new-code', postNeedNewCodeLPA(needViews));

module.exports = router;
