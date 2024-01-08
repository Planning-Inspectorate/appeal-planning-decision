const express = require('express');
const { enterPostcodeGet, enterPostcodePost } = require('./controller');
const asyncHandler = require('#utils/async-handler');

const router = express.Router();

router.get('/', asyncHandler(enterPostcodeGet));

router.post('/', asyncHandler(enterPostcodePost));

module.exports = { router };
