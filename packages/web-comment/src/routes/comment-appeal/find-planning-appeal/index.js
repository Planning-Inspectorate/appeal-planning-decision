const express = require('express');
const { findPlanningAppealGet, findPlanningAppealPost } = require('./controller');
const asyncHandler = require('../../../utils/async-handler');

const router = express.Router();

router.get('/', asyncHandler(findPlanningAppealGet));

router.post('/', asyncHandler(findPlanningAppealPost));

module.exports = { router };
