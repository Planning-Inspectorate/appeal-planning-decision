const express = require('express');
const {
	getLPAFinalCommentSubmission,
	patchLPAFinalCommentSubmission,
	createLPAFinalCommentSubmission
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

// LPA Final Comment routes
router.get('/', asyncHandler(getLPAFinalCommentSubmission));
router.post('/', lpaCanModifyCase, asyncHandler(createLPAFinalCommentSubmission));
router.patch('/', lpaCanModifyCase, asyncHandler(patchLPAFinalCommentSubmission));

module.exports = { router };
