const express = require('express');
const {
	getAppellantFinalCommentSubmission,
	patchAppellantFinalCommentSubmission,
	createAppellantFinalCommentSubmission
} = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const appellantCanModifyCase = require('../appellant-can-modify-case');
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

// SAppellant Final Comment routes
router.get('/', asyncHandler(getAppellantFinalCommentSubmission));
router.post('/', appellantCanModifyCase, asyncHandler(createAppellantFinalCommentSubmission));
router.patch('/', appellantCanModifyCase, asyncHandler(patchAppellantFinalCommentSubmission));

module.exports = { router };
