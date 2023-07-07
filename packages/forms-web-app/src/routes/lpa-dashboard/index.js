const express = require('express');
const router = express.Router();

const featureFlagMiddleware = require('../../middleware/feature-flag');
const { skipMiddlewareForPaths } = require('../../middleware/skip-middleware-for-paths');
const requireUser = require('../../middleware/lpa-dashboard/require-user');

router.use(featureFlagMiddleware('lpa-dashboard'));
router.use(
	skipMiddlewareForPaths(requireUser, [
		'service-invite',
		'enter-code',
		'request-new-code',
		'need-new-code',
		'code-expired',
		'enter-email',
		'your-email-address'
	])
);

router.use(require('./service-invite'));
router.use(require('./enter-code'));
router.use(require('./request-new-code'));
router.use(require('./need-new-code'));
router.use(require('./code-expired'));
router.use(require('./your-email-address'));

// temporary until page is built
router.get('/enter-email', function (req, res) {
	return res.sendStatus(200);
});

router.use(require('./your-appeals'));

router.use(require('./add-remove-users'));
router.use(require('./email-address'));

module.exports = router;
