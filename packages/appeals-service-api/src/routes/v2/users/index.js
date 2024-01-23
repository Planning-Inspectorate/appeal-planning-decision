const express = require('express');
const { userGet, userPost, userLink } = require('./controller');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');

router.get('/:email', asyncHandler(userGet));
router.post('/', asyncHandler(userPost));
router.post('/:email/appeal/:appealId', asyncHandler(userLink));

module.exports = { router };
