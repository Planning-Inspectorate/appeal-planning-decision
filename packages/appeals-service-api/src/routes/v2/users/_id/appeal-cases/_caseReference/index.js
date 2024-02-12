const express = require('express');
const { get } = require('./controller');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');

router.get('/', asyncHandler(get));

module.exports = { router };
