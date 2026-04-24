const express = require('express');
const { getUserAppeals, getDraft } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');
const router = express.Router({ mergeParams: true });

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.get('/', openApiValidatorMiddleware(), asyncHandler(getUserAppeals));
router.get('/draft/:id', openApiValidatorMiddleware(), asyncHandler(getDraft));

module.exports = { router };
