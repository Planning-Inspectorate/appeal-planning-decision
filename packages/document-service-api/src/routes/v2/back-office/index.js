const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const { getDocumentUrl, downloadDocument } = require('./controller');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const router = express.Router();

router.use(
	auth({
		issuerBaseURL: config.auth.authServerUrl + AUTH.OIDC_ENDPOINT,
		audience: AUTH.RESOURCE
	}),
	requiredScopes(AUTH.SCOPES.BO_DOCS_API.READ)
);

router.post('/sas-url', asyncHandler(getDocumentUrl));
router.get('/:document', asyncHandler(downloadDocument));

module.exports = { router };
