const express = require('express');
const { checkAnswersGet, checkAnswersPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(checkAnswersGet));

router.post('/', asyncHandler(checkAnswersPost));

module.exports = { router };
