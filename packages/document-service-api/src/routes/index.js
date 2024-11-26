/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const apiDocs = require('./api-docs');
const application = require('./application');
const { routes: v2Routes } = require('./v2');
const config = require('../configuration/config');

const router = Router();

/**
 * index route to avoid azure always on ping 404s
 */
router.get('/', (req, res) => {
	res.sendStatus(204);
});
router.get('/health', (req, res) => {
	res.status(200).send({
		status: 'OK',
		uptime: process.uptime(),
		commit: config.gitSha
	});
});

router.use('/api-docs', apiDocs);
//TODO: remove applicationId here since there isn't any notion of an appeal (its named incorrectly as well...) on any data store backing this API
router.use('/api/v1/:applicationId', application);

// v2 routes loaded from the file structure
for (const [url, handler] of Object.entries(v2Routes)) {
	const suffix = url.startsWith('/') ? url : `/${url}`;
	router.use(`/api/v2${suffix}`, handler);
}

module.exports = router;
