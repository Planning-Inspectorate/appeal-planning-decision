const express = require('express');
const { addCommentsGet, addCommentsPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(addCommentsGet));
router.post('/', asyncHandler(addCommentsPost));

module.exports = { router };
