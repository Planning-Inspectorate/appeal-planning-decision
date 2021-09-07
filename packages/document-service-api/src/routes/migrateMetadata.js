const { Router } = require('express');
const { migrate } = require('../controllers/migrateMetadata');

const router = Router();

router.get('/', migrate);

module.exports = router;
