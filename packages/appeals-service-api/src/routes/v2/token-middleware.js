const { AUTH } = require('@pins/common/src/constants');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateToken } = require('@pins/common/src/middleware/validate-token');

const config = require('../../configuration/config');

/**
 * @param {Object} [options]
 * @param {boolean} [options.enforceUserLoggedIn]
 * @returns {import('express').Handler[]}
 */
function checkAuthTokens({ enforceUserLoggedIn = true } = {}) {
	return [
		auth({
			issuerBaseURL: `${config.auth.authServerUrl}${AUTH.OIDC_ENDPOINT}`,
			audience: AUTH.RESOURCE
		}),
		validateToken({
			headerName: 'authentication',
			reqPropertyName: 'id_token',
			jwksUri: `${config.auth.authServerUrl}${AUTH.JWKS_ENDPOINT}`,
			enforceToken: enforceUserLoggedIn
		})
	];
}

module.exports = {
	checkAuthTokens
};
