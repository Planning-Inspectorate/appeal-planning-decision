const express = require('express');
const router = express.Router();

const { featureFlagMiddleware } = require('../../middleware/feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { skipMiddlewareForPaths } = require('../../middleware/skip-middleware-for-paths');
const requireUser = require('../../middleware/lpa-dashboard/require-user');

router.use(featureFlagMiddleware(FLAG.LPA_DASHBOARD));
router.use(
	skipMiddlewareForPaths(requireUser, [
		'service-invite',
		'enter-code',
		'request-new-code',
		'need-new-code',
		'code-expired',
		'your-email-address'
	])
);

// login
router.use(require('./service-invite'));
router.use(require('./enter-code'));
router.use(require('./request-new-code'));
router.use(require('./need-new-code'));
router.use(require('./code-expired'));
router.use(require('./your-email-address'));

// appeals
router.use(require('./your-appeals'));
router.use(require('./appeal-details'));
router.use(require('../../dynamic-forms/route'));
router.use(require('./decided-appeals'));

// manage users
router.use(require('./add-remove-users'));
router.use(require('./email-address'));
router.use(require('./confirm-add-user'));
router.use(require('./confirm-remove-user'));

module.exports = router;
