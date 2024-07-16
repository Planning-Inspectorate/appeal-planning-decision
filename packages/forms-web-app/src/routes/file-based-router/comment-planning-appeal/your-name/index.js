const express = require('express');
const { yourNameGet, yourNamePost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(yourNameGet));
router.post('/', asyncHandler(yourNamePost));

module.exports = { router };
