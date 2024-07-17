const express = require('express');
const { appeals } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(appeals));

module.exports = { router };
