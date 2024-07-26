const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const { put, post, deleteOldSubmissions } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
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

router.put('/', openApiValidatorMiddleware(), asyncHandler(put));
router.delete('/cleanup-old-submissions', asyncHandler(deleteOldSubmissions));

// debug route, delete once no longer required
router.post('/', asyncHandler(post));

module.exports = { router };
