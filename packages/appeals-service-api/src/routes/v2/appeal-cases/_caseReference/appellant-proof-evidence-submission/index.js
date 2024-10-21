const express = require('express');
const {
	getAppellantProofOfEvidenceSubmission,
	patchAppellantProofOfEvidenceSubmission,
	createAppellantProofOfEvidenceSubmission
} = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
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

// Appellant Proof Of Evidence routes
router.get('/', asyncHandler(getAppellantProofOfEvidenceSubmission));
router.post('/', asyncHandler(createAppellantProofOfEvidenceSubmission));
router.patch('/', asyncHandler(patchAppellantProofOfEvidenceSubmission));

module.exports = { router };
