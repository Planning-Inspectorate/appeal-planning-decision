const express = require('express');
const { createSubmissionIndividual, deleteSubmissionIndividual } = require('./controller');

const { AUTH } = require('@pins/common/src/constants');
const config = require('../../../../../configuration/config');
const { auth } = require('express-oauth2-jwt-bearer');
const { openApiValidatorMiddleware } = require('../../../../../validators/validate-open-api');
const userOwnsAppealSubmission = require('../user-owns-submission');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router({ mergeParams: true });

router.use(
	auth({
		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
		audience: AUTH.RESOURCE
	})
);

router.post(
	'/',
	openApiValidatorMiddleware(),
	userOwnsAppealSubmission,
	asyncHandler(createSubmissionIndividual)
);

router.delete(
	'/:individualId',
	openApiValidatorMiddleware(),
	userOwnsAppealSubmission,
	asyncHandler(deleteSubmissionIndividual)
);

module.exports = { router };
