const express = require('express');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');
const { put, r6UserUnlink } = require('./controller');

router.put('/', asyncHandler(put));
router.delete(
	'/:emailAddress/appeal-cases/:caseReference/unlinkRule6',
	openApiValidatorMiddleware(),
	asyncHandler(r6UserUnlink)
);

module.exports = { router };
