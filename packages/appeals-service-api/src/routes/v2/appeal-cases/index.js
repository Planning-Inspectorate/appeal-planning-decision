const express = require('express');
const { list, getByCaseReference, getCount } = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router();

router.get('/', asyncHandler(list));
router.get('/count', asyncHandler(getCount));
router.get('/:caseReference', asyncHandler(getByCaseReference));

module.exports = { router };
