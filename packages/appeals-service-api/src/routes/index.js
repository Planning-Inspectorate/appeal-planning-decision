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
const tokenRouter = require('./token');
const localPlanningAuthoritiesRouter = require('./local-planning-authorities');
const apiDocsRouter = require('./api-docs');
const confirmEmailRouter = require('./confirm-email');
const finalCommentsRouter = require('./final-comments');
const { isFeatureActive } = require('../configuration/featureFlag');

router.use('/api/v1/appeals', appealsRouter);
router.use('/api/v1/back-office', backOfficeRouter);
router.use('/api/v1/for-manual-intervention', forManualInterventionRouter);
router.use('/api/v1/local-planning-authorities', localPlanningAuthoritiesRouter);
router.use('/api-docs', apiDocsRouter);
router.use('/api/v1/save', saveRouter);
router.use('/api/v1/token', tokenRouter);
router.use('/api/v1/confirm-email', confirmEmailRouter);
router.use(
	'/api/v1/final_comments',
	(req, res, next) => {
		if (isFeatureActive('as-5408-final-comments', req.headers['local-planning-authority-code'])) {
			next();
		} else {
			res
				.status(400)
				.send({ error: 'This feature is not active for your local planning authority.' });
		}
	},
	finalCommentsRouter
);

module.exports = router;
