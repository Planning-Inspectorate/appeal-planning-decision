const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const { get, patch } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../configuration/config');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const { openApiValidatorMiddleware } = require('../../../../validators/validate-open-api');
const userOwnsSubmission = require('./user-owns-submission');

const router = express.Router({ mergeParams: true });

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.use(
	validateToken({
		headerName: 'authentication',
		reqPropertyName: 'id_token',
		jwksUri: `${config.auth.authServerUrl}${AUTH.JWKS_ENDPOINT}`,
		enforceToken: false
	})
);

router.get('/', openApiValidatorMiddleware(), asyncHandler(get));
router.get('/confirm-ownership', openApiValidatorMiddleware(), userOwnsSubmission);

router.patch('/', openApiValidatorMiddleware(), asyncHandler(patch));

module.exports = { router };
