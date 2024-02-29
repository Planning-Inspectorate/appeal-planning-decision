const express = require('express');

const { tokenPutV2 } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.put('/', asyncHandler(tokenPutV2));

module.exports = { router };
