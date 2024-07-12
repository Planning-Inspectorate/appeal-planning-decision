const express = require('express');
const { list, getByCaseReference, putByCaseReference, getCount } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');

const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');
const router = express.Router();

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

router.get('/', asyncHandler(list));
router.get('/count', asyncHandler(getCount));
router.get('/:caseReference', openApiValidatorMiddleware(), asyncHandler(getByCaseReference));
router.put('/:caseReference', openApiValidatorMiddleware(), asyncHandler(putByCaseReference));

module.exports = { router };
