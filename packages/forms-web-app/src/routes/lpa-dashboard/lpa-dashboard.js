const express = require('express');
const { skipMiddlewareForPaths } = require('../../middleware/skip-middleware-for-paths');
const requireUser = require('../../middleware/lpa-dashboard/require-user');

const router = express.Router();

router.use(
	skipMiddlewareForPaths(requireUser, [
		'input-code',
		'need-new-code',
		'code-expired',
		'enter-email'
	])
);

router.get('/', function (req, res) {
	return res.sendStatus(200);
});

router.get('/enter-email', function (req, res) {
	return res.sendStatus(200);
});

module.exports = router;
