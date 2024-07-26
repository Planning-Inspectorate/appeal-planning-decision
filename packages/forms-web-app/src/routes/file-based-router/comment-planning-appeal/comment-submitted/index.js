const express = require('express');
const { commentSubmittedGet } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(commentSubmittedGet));

module.exports = { router };
