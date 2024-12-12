const express = require('express');
const { patch } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../../validators/validate-open-api');
const router = express.Router({ mergeParams: true });

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.patch('/', openApiValidatorMiddleware(), asyncHandler(patch));

module.exports = { router };
