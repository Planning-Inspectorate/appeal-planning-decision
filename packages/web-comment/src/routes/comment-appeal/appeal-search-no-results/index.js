const express = require('express');
const {
	appealSearchNoResults
} = require('../../../controllers/comment-appeal/appeal-search-no-results/controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(appealSearchNoResults));

module.exports = { router };
