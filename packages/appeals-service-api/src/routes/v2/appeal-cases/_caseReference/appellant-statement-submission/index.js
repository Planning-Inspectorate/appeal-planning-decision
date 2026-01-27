const express = require('express');
const {
	getAppellantStatementSubmission,
	patchAppellantStatementSubmission,
	createAppellantStatementSubmission
} = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const appellantCanModifyCase = require('../appellant-can-modify-case');
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

// Statement routes
router.get('/', asyncHandler(getAppellantStatementSubmission));
router.post('/', appellantCanModifyCase, asyncHandler(createAppellantStatementSubmission));
router.patch('/', appellantCanModifyCase, asyncHandler(patchAppellantStatementSubmission));

module.exports = { router };
