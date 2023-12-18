const express = require('express');
const { enterAppealReferenceGet, enterAppealReferencePost } = require('./controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(enterAppealReferenceGet));
router.post('/', asyncHandler(enterAppealReferencePost));

module.exports = { router };
