const express = require('express');
const { checkAnswersGet, checkAnswersPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const checkInterestedPartySessionActive = require('../../../../middleware/interested-parties/check-ip-session-set');

const router = express.Router();

router.get('/', checkInterestedPartySessionActive, asyncHandler(checkAnswersGet));

router.post('/', asyncHandler(checkAnswersPost));

module.exports = { router };
