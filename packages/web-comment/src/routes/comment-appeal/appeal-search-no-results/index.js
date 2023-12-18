const express = require('express');
const { appealSearchNoResults } = require('./controller');
const asyncHandler = require('../../../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(appealSearchNoResults));

module.exports = { router };
