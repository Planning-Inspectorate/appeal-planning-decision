const express = require('express');
const {
	findPlanningAppealGet,
	findPlanningAppealPost
} = require('../../../controllers/comment-appeal/find-planning-appeal/controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(findPlanningAppealGet));

router.post('/', asyncHandler(findPlanningAppealPost));

module.exports = { router };
