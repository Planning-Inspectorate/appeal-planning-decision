const express = require('express');
const {
	getLPAStatementSubmission,
	patchLPAStatementSubmission,
	createLPAStatementSubmission
} = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const lpaCanModifyCase = require('../lpa-questionnaire-submission/lpa-can-modify-case');
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

// Statement routes
router.get('/', asyncHandler(getLPAStatementSubmission));
router.post('/', lpaCanModifyCase, asyncHandler(createLPAStatementSubmission));
router.patch('/', lpaCanModifyCase, asyncHandler(patchLPAStatementSubmission));

module.exports = { router };