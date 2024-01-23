const express = require('express');
const { getUserAppeals } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(getUserAppeals));

module.exports = { router };
