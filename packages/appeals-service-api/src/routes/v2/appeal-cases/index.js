const express = require('express');
const { list, getByCaseReference, putByCaseReference, getCount } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');
const router = express.Router();

router.get('/', asyncHandler(list));
router.get('/count', asyncHandler(getCount));
router.get('/:caseReference', asyncHandler(getByCaseReference));
router.put(
	'/:caseReference',
	// validate requests against OpenAPI spec
	openApiValidatorMiddleware(),
	asyncHandler(putByCaseReference)
);

module.exports = { router };
