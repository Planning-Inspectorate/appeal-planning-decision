/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */
const express = require('express');

const router = express.Router();

const appealsRouter = require('./appeals');
const appealsHorizonRouter = require('./appealsHorizon');
const localPlanningAuthoritiesRouter = require('./local-planning-authorities');
const apiDocsRouter = require('./api-docs');

router.use('/api/v1/appeals', appealsRouter);
router.use('/api/v1/appeals-horizon', appealsHorizonRouter);
router.use('/api/v1/local-planning-authorities', localPlanningAuthoritiesRouter);
router.use('/api-docs', apiDocsRouter);

module.exports = router;
