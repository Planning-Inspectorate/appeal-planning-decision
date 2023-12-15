const express = require('express');
const {
	decidedAppeals
} = require('../../../controllers/comment-appeal/decided-appeals/controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(decidedAppeals));

module.exports = { router };
