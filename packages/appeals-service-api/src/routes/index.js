/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */
const express = require('express');

const router = express.Router();

const appeals = require('./appeals');
const lpas = require('./local-planning-authorities');
const apiDocs = require('./api-docs');

router.use('/api/v1/appeals', appeals);
router.use('/api/v1/local-planning-authorities', lpas);
router.use('/api-docs', apiDocs);

module.exports = router;
