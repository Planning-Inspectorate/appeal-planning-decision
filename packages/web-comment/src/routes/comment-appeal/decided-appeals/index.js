const express = require('express');
const { decidedAppeals } = require('./controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(decidedAppeals));

module.exports = { router };
