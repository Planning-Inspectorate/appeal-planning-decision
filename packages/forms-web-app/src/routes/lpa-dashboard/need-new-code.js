const express = require('express');
const { getNeedNewCode, postNeedNewCode } = require('../../controllers/common/need-new-code');
const { skipMiddlewareForPaths } = require('../../middleware/skip-middleware-for-paths');
const requireUser = require('../../middleware/lpa-dashboard/require-user');

const router = express.Router();

router.use(skipMiddlewareForPaths(requireUser, ['need-new-code']));

const {
	VIEW: {
		LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
	}
} = require('../../lib/views');

const needViews = { NEED_NEW_CODE, ENTER_CODE };

router.get('/need-new-code/:id', getNeedNewCode(needViews));
router.post('/need-new-code/:id', postNeedNewCode(needViews));

module.exports = router;
