const express = require('express');
const { getAppealEvents } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { openApiValidatorMiddleware } = require('../../../../../validators/validate-open-api');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router({ mergeParams: true });
router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.get('/', openApiValidatorMiddleware(), asyncHandler(getAppealEvents));

module.exports = { router };
