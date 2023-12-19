const express = require('express');
const { decidedAppeals } = require('./controller');
const asyncHandler = require('#utils/async-handler');

const router = express.Router();

router.get('/', asyncHandler(decidedAppeals));

module.exports = { router };
