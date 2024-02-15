const express = require('express');
const { setCommentDeadline } = require('../controllers/debug');

const router = express.Router();

router.get('/set-comment-deadline', setCommentDeadline);

const config = require('../config');
const oidcClient = require('openid-client');
const { apiClient } = require('#lib/appeals-api-client');

async function getClient() {
	const issuer = await oidcClient.Issuer.discover(
		'http://auth-server:3000/oidc/.well-known/openid-configuration'
	);

	const client = new issuer.Client({
		client_id: config.oauth.clientID,
		client_secret: config.oauth.clientSecret,
		//redirect_uris: ['http://localhost:9003/debug/oidc'],
		response_types: ['code'],
		token_endpoint_auth_method: 'client_secret_jwt'
	});

	return client;
}

/** @type {import('express').Handler} */
const clientCreds = async (req, res) => {
	try {
		const client = await getClient();

		const tokenSet = await client.grant({
			resource: 'appeals-front-office',
			grant_type: 'client_credentials',
			scope: 'read write'
		});

		let test = {};
		test = await apiClient.getAuth(tokenSet.access_token);
		//test = await client.userinfo(tokenSet.access_token); // todo: check this returns idtoken once db setup

		res.status(200).send({ test, tokenSet });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};

router.get('/clientCreds', clientCreds);

const password = async (req, res) => {
	try {
		const client = await getClient();

		let tokenSet;
		try {
			tokenSet = await client.grant({
				resource: 'appeals-front-office',
				grant_type: 'ropc-otp',
				scope: 'userinfo openid email appeals:read',
				email: 'test@example.com',
				otp: 'abcde'
			});
		} catch (err) {
			tokenSet = err.response.statusCode;
		}

		req.session.access_token = tokenSet.access_token;

		let test = {};
		try {
			test = await apiClient.getAuth(tokenSet.access_token);
		} catch (err) {
			test = err;
		}

		res.status(200).send({ test, tokenSet });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};

router.get('/password', password);

router.get('/userinfo', async function (req, res) {
	const issuer = await oidcClient.Issuer.discover(
		'http://auth-server:3000/oidc/.well-known/openid-configuration'
	);

	const client = new issuer.Client({
		client_id: config.oauth.clientID,
		client_secret: config.oauth.clientSecret,
		response_types: ['code'],
		token_endpoint_auth_method: 'client_secret_jwt'
	});

	const access_token = req.session.access_token;
	let test;
	try {
		test = await client.userinfo(access_token);
	} catch (err) {
		test = err;
	}

	res.status(200).send({ test });
});

// 	res.status(200).send({ test, access_token });
// });

// unused auth code flow examples, currently not working fully - is it resource server defining jwt format?
// router.get('/auth', async function (req, res) {
// 	try {
// 		const client = await getClient();

// 		const code_verifier = oidcClient.generators.codeVerifier();
// 		req.session.code_verifier = code_verifier;

// 		const code_challenge = oidcClient.generators.codeChallenge(code_verifier);

// 		const url = client.authorizationUrl({
// 			scope: 'read write',
// 			resource: 'appeals-front-office',
// 			code_challenge,
// 			code_challenge_method: 'S256'
// 		});

// 		res.status(200).send({ url, code_verifier, code_challenge });
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).send(err);
// 	}
// });

// router.get('/oidc', async function (req, res) {
// 	const client = await getClient();

// 	const code_verifier = req.session.code_verifier;
// 	const params = client.callbackParams(req);

// 	const tokenSet = await client.callback('http://auth-server:3000/callback', params, {
// 		code_verifier
// 	});

// 	const userinfo = await client.userinfo(tokenSet.access_token);

// 	let test = {};
// 	//test = await apiClient.getAuth(tokenSet.access_token);

// 	res.status(200).send({
// 		...test,
// 		...userinfo
// 	});

// 	res.status(200).send(req.session.params);
// });

// router.get('/next', async function (req, res) {
// 	const params = req.session.params;
// 	const code_verifier = req.session.code_verifier;

// 	const client = await getClient();

// 	const tokenSet = await client.callback('http://auth-server:3000/callback', params, {
// 		code_verifier
// 	});

// 	const userinfo = await client.userinfo(tokenSet.access_token);

// 	let test = {};
// 	//test = await apiClient.getAuth(tokenSet.access_token);

// 	res.status(200).send({
// 		...test,
// 		...userinfo
// 	});
// });

// router.get('/log', async function (req, res) {
// 	res.status(200).send({
// 		...req.params,
// 		url: req.url
// 	});
// });

module.exports = router;
