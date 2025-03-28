const express = require('express');
const { enterAppealReferenceGet, enterAppealReferencePost } = require('./controller');
const checkInterestedPartyLogInNotExpired = require('../../../../middleware/interested-parties/check-ip-log-in');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', checkInterestedPartyLogInNotExpired, asyncHandler(enterAppealReferenceGet));
router.post('/', asyncHandler(enterAppealReferencePost));

module.exports = { router };
