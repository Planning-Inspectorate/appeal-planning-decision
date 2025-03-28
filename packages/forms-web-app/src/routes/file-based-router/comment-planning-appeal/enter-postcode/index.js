const express = require('express');
const checkInterestedPartyLogInNotExpired = require('../../../../middleware/interested-parties/check-ip-log-in');
const { enterPostcodeGet, enterPostcodePost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', checkInterestedPartyLogInNotExpired, asyncHandler(enterPostcodeGet));
router.post('/', asyncHandler(enterPostcodePost));

module.exports = { router };
