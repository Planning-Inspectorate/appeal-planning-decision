const express = require('express');
const router = express.Router();
const { auth } = require('express-oauth2-jwt-bearer');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { AUTH } = require('@pins/common/src/constants');
const { put, delete: del } = require('./controller');
const config = require('../../../configuration/config');

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.put('/', asyncHandler(put));
router.delete('/:id', asyncHandler(del));

module.exports = { router };
