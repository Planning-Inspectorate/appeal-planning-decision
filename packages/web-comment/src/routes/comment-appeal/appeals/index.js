const express = require('express');
const { appeals } = require('./controller');
const asyncHandler = require('../../../utils/async-handler');

const router = express.Router();

router.get('/', asyncHandler(appeals));

module.exports = { router };
