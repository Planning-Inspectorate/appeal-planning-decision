const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { appealOpenComment } = require('./controller');

const router = express.Router();

router.get('/', asyncHandler(appealOpenComment));

module.exports = { router };
