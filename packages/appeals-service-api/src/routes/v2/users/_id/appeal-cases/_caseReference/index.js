const express = require('express');
const { get } = require('./controller');
const router = express.Router({ mergeParams: true });
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const {
	checkCaseAccess
} = require('../../../../appeal-cases/_caseReference/case-auth-middleware.js');

router.get('/', checkCaseAccess({ enforceUserLoggedIn: true }), asyncHandler(get));

module.exports = { router };
