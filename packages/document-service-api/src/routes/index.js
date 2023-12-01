/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const apiDocs = require('./api-docs');
const application = require('./application');
const migrateMetadata = require('./migrateMetadata');

const router = Router();

router.use('/api-docs', apiDocs);
router.use('/api/v1/migrate-metadata', migrateMetadata);
//TODO: remove applicationId here since there isn't any notion of an appeal (its named incorrectly as well...) on any data store backing this API
router.use('/api/v1/:applicationId', application);

module.exports = router;
