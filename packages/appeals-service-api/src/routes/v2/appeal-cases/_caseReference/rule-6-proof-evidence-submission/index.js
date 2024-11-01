const express = require('express');
const {
	getRule6ProofOfEvidenceSubmission,
	patchRule6ProofOfEvidenceSubmission,
	createRule6ProofOfEvidenceSubmission
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

// Rule 6 Proof Of Evidence routes
router.get('/', asyncHandler(getRule6ProofOfEvidenceSubmission));
router.post('/', rule6PartyCanModifyCase, asyncHandler(createRule6ProofOfEvidenceSubmission));
router.patch('/', rule6PartyCanModifyCase, asyncHandler(patchRule6ProofOfEvidenceSubmission));

module.exports = { router };
