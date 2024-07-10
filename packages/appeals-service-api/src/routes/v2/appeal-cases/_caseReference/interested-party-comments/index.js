const express = require('express');
const { getCommentsForCase, createComment } = require('./controller');
const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');

const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../../../validators/validate-open-api');
const router = express.Router({ mergeParams: true });

// todo, apply auth check to all endpoints, requires use of req.appealsApiClient throughout front end
router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.get('/', openApiValidatorMiddleware(), asyncHandler(getCommentsForCase));
router.post('/', openApiValidatorMiddleware(), asyncHandler(createComment));

module.exports = { router };
