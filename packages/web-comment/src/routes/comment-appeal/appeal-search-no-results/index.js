const express = require('express');
const { appealSearchNoResults } = require('./controller');
const asyncHandler = require('../../../utils/async-handler');

const router = express.Router();

router.get('/', asyncHandler(appealSearchNoResults));

module.exports = { router };
