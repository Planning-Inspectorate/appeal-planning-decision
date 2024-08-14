const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { put, get } = require('./controller');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');

const router = express.Router();

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.put('/', openApiValidatorMiddleware(), asyncHandler(put));
router.get('/:reference', asyncHandler(get));

module.exports = { router };
