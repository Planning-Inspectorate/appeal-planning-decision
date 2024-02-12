const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const { tokenPutV2, tokenPostV2 } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.put('/', asyncHandler(tokenPutV2));
router.post('/', asyncHandler(tokenPostV2));

router.use(
	auth({
		issuerBaseURL: 'http://auth-server:3000/oidc',
		audience: 'http://appeals-service-api'
	})
);
router.get('/test', function (req, res) {
	res.status(200).send({ hello: 'hi!' });
});

module.exports = { router };
