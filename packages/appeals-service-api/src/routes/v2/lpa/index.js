const express = require('express');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const controller = require('./controller');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');

router.get('/', openApiValidatorMiddleware(), asyncHandler(controller.getAll));
router.get('/:id', openApiValidatorMiddleware(), asyncHandler(controller.getById));
router.get(
	'/lpaCode/:lpaCode',
	openApiValidatorMiddleware(),
	asyncHandler(controller.getBylpaCode)
);
router.get(
	'/lpa19CD/:lpa19CD',
	openApiValidatorMiddleware(),
	asyncHandler(controller.getBylpa19CD)
);
router.post('/', openApiValidatorMiddleware(), asyncHandler(controller.post));

module.exports = { router };
