const express = require('express');
const { getAppealCaseWithCosts } = require('./controller');
const { checkCaseAccess } = require('../case-auth-middleware');

const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.use(checkCaseAccess({ enforceUserLoggedIn: true }));

router.get('/', asyncHandler(getAppealCaseWithCosts));

module.exports = { router };
