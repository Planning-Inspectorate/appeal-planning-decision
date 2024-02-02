const express = require('express');
const { selectedAppeal } = require('./controller');
const asyncHandler = require('#utils/async-handler');

const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(selectedAppeal));

module.exports = { router };
