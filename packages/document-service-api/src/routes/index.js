/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const apiDocs = require('./apiDocs');
const application = require('./application');
const migrateMetadata = require('./migrateMetadata');
const isFeatureActive = require('../../config/featureFlag')

const router = Router();

router.use('/api-docs', apiDocs);
router.use('/api/v1/migrate-metadata', migrateMetadata);
router.use('/api/v1/:applicationId', application);
router.get('/api/v1/featureFlag', async (_, res) =>
{ 
	if (await isFeatureActive('test-flag')) { 
        res.send('Flag on')
    } else { 
        res.send('Flag off')
    }
});

module.exports = router;
