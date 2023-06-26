const express = require('express');
const featureFlagMiddleware = require('../../middleware/feature-flag');
const { skipMiddlewareForPaths } = require('../../middleware/skip-middleware-for-paths');
const requireUser = require('../../middleware/lpa-dashboard/require-user');
const { getServiceInvite } = require('../../../src/controllers/lpa-dashboard/service-invite');

const router = express.Router();

router.use(featureFlagMiddleware('lpa-dashboard'));
router.use(
	skipMiddlewareForPaths(requireUser, [
		'input-code',
		'need-new-code',
		'code-expired',
		'enter-email',
		'service-invite',
		'request-new-code',
		'enter-code'
	])
);

router.get('/service-invite/:lpaCode', getServiceInvite);

router.get('/', function (req, res) {
	return res.sendStatus(200);
});

router.get('/enter-email', function (req, res) {
	return res.sendStatus(200);
});

module.exports = router;
