const express = require('express');
const {
	getRule6StatementSubmission,
	patchRule6StatementSubmission,
	createRule6StatementSubmission
} = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const rule6PartyCanModifyCase = require('../rule-6-party-can-modify-case');
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

// Rule 6 Statement routes
router.get('/', asyncHandler(getRule6StatementSubmission));
router.post('/', rule6PartyCanModifyCase, asyncHandler(createRule6StatementSubmission));
router.patch('/', rule6PartyCanModifyCase, asyncHandler(patchRule6StatementSubmission));

module.exports = { router };
