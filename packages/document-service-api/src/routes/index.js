/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const apiDocs = require('./apiDocs');
const application = require('./application');
const migrateMetadata = require('./migrateMetadata');

const router = Router();

router.use('/api-docs', apiDocs);
router.use('/api/v1/migrate-metadata', migrateMetadata);
router.use('/api/v1/:applicationId', application);

module.exports = router;
