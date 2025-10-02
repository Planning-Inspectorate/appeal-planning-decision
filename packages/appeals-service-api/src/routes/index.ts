/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */
const express = require('express');

const router = express.Router();

const appealsRouter = require('./appeals');
const backOfficeRouter = require('./back-office');
const forManualInterventionRouter = require('./for-manual-intervention');
const saveRouter = require('./save');
const localPlanningAuthoritiesRouter = require('./local-planning-authorities');
const { routes: v2Routes } = require('./v2');
const config = require('../configuration/config');

/**
 * index route to avoid azure always on ping 404s
 */
router.get('/', (req: import('express').Request, res: import('express').Response) => {
	res.sendStatus(204);
});

router.get('/health', (req: import('express').Request, res: import('express').Response) => {
	res.status(200).send({
		status: 'OK',
		uptime: process.uptime(),
		commit: config.gitSha
	});
});

router.use('/api/v1/appeals', appealsRouter);
router.use('/api/v1/back-office', backOfficeRouter);
router.use('/api/v1/for-manual-intervention', forManualInterventionRouter);
router.use('/api/v1/local-planning-authorities', localPlanningAuthoritiesRouter);
router.use('/api/v1/save', saveRouter);

// v2 routes loaded from the file structure
for (const [url, handler] of Object.entries(v2Routes)) {
	const suffix = url.startsWith('/') ? url : `/${url}`;
	router.use(`/api/v2${suffix}`, handler);
}

if (config.enableApiDocs) {
	// only add api docs if we need them (i.e. we aren't just running tests)
	const apiDocsRouter = require('./api-docs');
	router.use('/api-docs', apiDocsRouter);
}

module.exports = router;
