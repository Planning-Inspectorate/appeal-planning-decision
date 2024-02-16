const express = require('express');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const router = express.Router();

const { tokenPutV2 } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

router.put('/', asyncHandler(tokenPutV2));

router.use(
	auth({
		issuerBaseURL: config.auth.authServerUrl + AUTH.OIDC_ENDPOINT,
		audience: AUTH.RESOURCE
	}),
	requiredScopes(AUTH.SCOPES.APPEALS_API.READ)
);

router.get('/test', function (req, res) {
	res.status(200).send({ auth: req.auth });
});

module.exports = { router };
