const express = require('express');
const { list, getByCaseReference, putByCaseReference, getCount } = require('./controller');

const { checkCaseAccess } = require('./_caseReference/case-auth-middleware');
const { checkAuthTokens } = require('../token-middleware');

const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');
const router = express.Router();

router.use(checkAuthTokens({ enforceUserLoggedIn: false }));

router.get('/', asyncHandler(list));
router.get('/count', asyncHandler(getCount));
router.get('/:caseReference', openApiValidatorMiddleware(), asyncHandler(getByCaseReference));
router.put('/:caseReference', asyncHandler(putByCaseReference));
router.get(
	'/:caseReference/confirm-access',
	checkCaseAccess({ enforceUserLoggedIn: true }),
	/**@type {import('express').RequestHandler} */
	(_, res) => {
		return res.status(200).send({ message: 'User has access to the appeal case' });
	}
);

module.exports = { router };
