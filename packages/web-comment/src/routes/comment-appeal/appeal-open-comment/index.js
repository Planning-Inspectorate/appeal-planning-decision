const express = require('express');
const asyncHandler = require('../../../utils/asyncHandler');
const {
	appealOpenComment
} = require('../../../controllers/comment-appeal/appeal-open-comment/controller');

const router = express.Router();

router.get('/', asyncHandler(appealOpenComment));

module.exports = { router };
