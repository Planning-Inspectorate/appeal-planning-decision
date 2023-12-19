const express = require('express');
const asyncHandler = require('../../../utils/async-handler');
const { appealOpenComment } = require('./controller');

const router = express.Router();

router.get('/', asyncHandler(appealOpenComment));

module.exports = { router };
