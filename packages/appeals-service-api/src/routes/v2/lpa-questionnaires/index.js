const express = require('express');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { put } = require('./controller');

router.put('/', asyncHandler(put));

module.exports = { router };
