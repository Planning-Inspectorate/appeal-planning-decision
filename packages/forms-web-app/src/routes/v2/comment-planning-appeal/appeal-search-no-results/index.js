const express = require('express');
const { appealSearchNoResults } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(appealSearchNoResults));

module.exports = { router };
