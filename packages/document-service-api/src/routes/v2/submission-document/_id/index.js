const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
// const { AUTH } = require('@pins/common/src/constants');
// const config = require('../../../configuration/config');
// const { auth } = require('express-oauth2-jwt-bearer');
const { deleteDocument } = require('./controller');

const router = express.Router({ mergeParams: true });

// todo: add auth client to allow calls between appeals-api <-> docs-api
// router.use(
// 	auth({
// 		issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
// 		audience: AUTH.RESOURCE
// 	})
// );

router.delete('/', asyncHandler(deleteDocument));

module.exports = { router };
