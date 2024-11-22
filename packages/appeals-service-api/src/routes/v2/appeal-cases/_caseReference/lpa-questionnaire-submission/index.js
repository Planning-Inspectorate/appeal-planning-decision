const express = require('express');
const {
	getLPAQuestionnaireSubmission,
	patchLPAQuestionnaireSubmission,
	createLPAQuestionnaireSubmission,
	getLPAQuestionnaireDownloadDetailsByCaseReference
} = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { AUTH } = require('@pins/common/src/constants');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');
const config = require('../../../../../configuration/config');
const lpaCanModifyCase = require('./lpa-can-modify-case');
const router = express.Router({ mergeParams: true });

// Questionnaire routes
router.get('/', asyncHandler(getLPAQuestionnaireSubmission));
router.post('/', asyncHandler(createLPAQuestionnaireSubmission));
router.patch('/', asyncHandler(patchLPAQuestionnaireSubmission));
router.get(
	'/download-details',
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	}),
	validateToken({
		headerName: 'authentication',
		reqPropertyName: 'id_token',
		jwksUri: `${config.auth.authServerUrl}${AUTH.JWKS_ENDPOINT}`,
		enforceToken: false
	}),
	lpaCanModifyCase,
	asyncHandler(getLPAQuestionnaireDownloadDetailsByCaseReference)
);
module.exports = { router };
