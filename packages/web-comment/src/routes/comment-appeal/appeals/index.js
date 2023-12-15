const express = require('express');
const { appeals } = require('../../../controllers/comment-appeal/appeals/controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(appeals));

module.exports = { router };
