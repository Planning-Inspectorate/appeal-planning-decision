# Appeals Service API

The microservice API for auth server

OAUTH2 + openid connect auth server serving signed access + id tokens and verification methods

## Well known endpoint

The well known endpoint is hosted at the following endpoint: /oidc/.well-known/openid-configuration

## OTP grant type

Have added a custom grant type that generates and sends a  short lived one time password (OTP) to the specified user, replacing the token api in appeals-api

## ROPC grant type

Have added a custom grant type following the Resource Owner Password Credentials Grant (ROPC) spec https://datatracker.ietf.org/doc/html/rfc6749#section-4.3

This checks a short lived one time password (OTP) generated and held in the token table and returns an access token belonging to the user and an id token that contains additional user data

## Adapter

Data store, in our case prisma, all data held in a single Oidc table

## Token format

Using Json Web token (JWT) - the only way the auth server returns a token in this format is if the resource server is specified to require that format, otherwise will send an 'opaque' token

## Token Signing

tokens are signed with JSON Web Key Set (JWKs) with an a/symmetric key, to prove a token has been generated by the auth server, this must be checked

## Resources

Only one resource can be present in a token so it is used for every api

## Scopes

- filters what user details are returned in id token
- can be used to limit access to specific api endpoints/servers 

## validating access token

with express-oauth2-jwt-bearer

use auth to validate the token has come from auth server and still valid

use helper methods such as requiredScopes to enforce a specific scope on the endpoint

use req.auth to check specific details about user

- req.auth.payload.sub -> who has made the request (user id, or client id if a client credentials request)
- req.auth.payload.client_id -> the client id i.e id of server request originated from
- req.auth.payload.scope -> space separated strings attached to the token

```js
router.use(
	auth({
		issuerBaseURL: 'http://auth-server/oidc',
		audience: 'http://resource-server'
	}),
	requiredScopes('appeals:read')
);

router.get('/test', function (req, res) {
	res.status(200).send({ auth: req.payload });
});
```

## Key Vault Secrets

prepend new values to array and subsequently drop old ones off

- appeals-auth-server-cookies-keys
  JSON array of strings
- appeals-auth-server-jwks
  JSON Array of JWK, generate new by setting algorithm and calling node ./dev/gen-keys.js
  Ensure alg used is allowed by client.id_token_signed_response_alg