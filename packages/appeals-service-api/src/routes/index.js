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
const finalCommentsRouter = require('./final-comments');
const usersRouter = require('./users');
const lpaDashboardAppealsRouter = require('./appeals-case-data');
const documentMetadataRouter = require('./documentMetadata');

router.use('/api/v1/appeals', appealsRouter);
router.use('/api/v1/back-office', backOfficeRouter);
router.use('/api/v1/for-manual-intervention', forManualInterventionRouter);
router.use('/api/v1/local-planning-authorities', localPlanningAuthoritiesRouter);
router.use('/api-docs', apiDocsRouter);
router.use('/api/v1/save', saveRouter);
router.use('/api/v1/token', tokenRouter);
router.use('/api/v1/final-comments', finalCommentsRouter);
router.use('/api/v1/users', usersRouter);
router.use('/api/v1/appeals-case-data', lpaDashboardAppealsRouter);
router.use('/api/v1/document-meta-data', documentMetadataRouter);

module.exports = router;
