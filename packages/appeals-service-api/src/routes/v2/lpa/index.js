const express = require('express');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const controller = require('./controller');

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getById));
router.get('/lpaCode/:lpaCode', asyncHandler(controller.getBylpaCode));
router.get('/lpa19CD/:lpa19CD', asyncHandler(controller.getBylpa19CD));
router.post('/', asyncHandler(controller.post));

module.exports = { router };
