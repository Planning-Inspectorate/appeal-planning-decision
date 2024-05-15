const express = require('express');
const { createSubmissionAddress, deleteSubmissionAddress } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const { openApiValidatorMiddleware } = require('../../../../../../validators/validate-open-api');
const lpaCanModifyCase = require('../lpa-can-modify-case');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

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
		enforceToken: true
	})
);

router.post(
	'/',
	openApiValidatorMiddleware(),
	lpaCanModifyCase,
	asyncHandler(createSubmissionAddress)
);

router.delete(
	'/:addressId',
	openApiValidatorMiddleware(),
	lpaCanModifyCase,
	asyncHandler(deleteSubmissionAddress)
);

module.exports = { router };
