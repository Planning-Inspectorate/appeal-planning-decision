const express = require('express');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const router = express.Router();

const { tokenPutV2 } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

router.put('/', asyncHandler(tokenPutV2));

router.use(
	auth({
		issuerBaseURL: 'http://auth-server:3000/oidc',
		audience: 'appeals-front-office'
	}),
	requiredScopes('appeals:read')
);

router.get('/test', function (req, res) {
	res.status(200).send({ hello: 'hi!' });
});

module.exports = { router };
