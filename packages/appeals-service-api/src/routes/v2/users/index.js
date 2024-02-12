const express = require('express');
const { userGet, userPost, userLink } = require('./controller');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');

// Would be nice to untangle this at some point, we're using
// this first param for email and id
router.get('/:email', asyncHandler(userGet));
router.post('/', asyncHandler(userPost));
router.post('/:email/appeal/:appealId', asyncHandler(userLink));

module.exports = { router };
