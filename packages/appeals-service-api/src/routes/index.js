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
const responsesRouter = require('./responses');
const listedBuildingRouter = require('./listed-building');
const { routes: v2Routes } = require('./v2');

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
router.use('/api/v1/responses', responsesRouter);
router.use('/api/v1/listed-buildings', listedBuildingRouter);

// v2 routes loaded from the file structure
for (const [url, handler] of Object.entries(v2Routes)) {
	router.use(`/api/v2/${url}`, handler);
}

// v2 routes loaded from the file structure
for (const [url, handler] of Object.entries(v2Routes)) {
	router.use(`/api/v2/${url}`, handler);
}

module.exports = router;
