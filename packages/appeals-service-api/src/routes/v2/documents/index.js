const express = require('express');
const router = express.Router();
const { auth } = require('express-oauth2-jwt-bearer');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { AUTH } = require('@pins/common/src/constants');
const controller = require('./controller');
const config = require('../../../configuration/config');

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.get('/:id', asyncHandler(controller.get));
router.put('/', asyncHandler(controller.put));
router.delete('/:id', asyncHandler(controller.delete));

module.exports = { router };
