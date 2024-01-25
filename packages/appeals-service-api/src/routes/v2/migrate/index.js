const express = require('express');
const router = express.Router();
const asyncHandler = require('../../../middleware/async-handler');
const { migrateAppeals } = require('./controller');

router.get('/appeals', asyncHandler(migrateAppeals));

module.exports = { router };
