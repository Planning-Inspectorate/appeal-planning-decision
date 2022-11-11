/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */
const express = require('express');

const router = express.Router();

const appealsRouter = require('./appeals');
const saveRouter = require('./save');
const appealsHorizonRouter = require('./appealsHorizon');
const localPlanningAuthoritiesRouter = require('./local-planning-authorities');
const apiDocsRouter = require('./api-docs');
const confirmEmailRouter = require('./confirm-email');
const finalCommentsRouter = require('./final-comments');

router.use('/api/v1/appeals', appealsRouter);
router.use('/api/v1/appeals-horizon', appealsHorizonRouter);
router.use('/api/v1/local-planning-authorities', localPlanningAuthoritiesRouter);
router.use('/api-docs', apiDocsRouter);
router.use('/api/v1/save', saveRouter);
router.use('/api/v1/confirm-email', confirmEmailRouter);
router.use('/api/v1/final_comments', finalCommentsRouter);

module.exports = router;
