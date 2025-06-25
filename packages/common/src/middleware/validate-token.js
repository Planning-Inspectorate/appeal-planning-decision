let joseImport = null;
const getJose = async () => {
	if (!joseImport) {
		joseImport = await import('jose');
	}
	return joseImport;
};

/**
 * Validates a JWT token on an express request
 * @param {Object} options
 * @param {string} options.headerName - header the token is attached to
 * @param {string} options.jwksUri - uri that holds the public JWKS key
 * @param {boolean} [options.enforceToken] - if true will 401 if token not present in header
 * @param {number} [options.cacheMaxAgeSeconds] - number of seconds to cache the JWK result
 * @param {string} [options.reqPropertyName] - the property
 * @returns {import('express').Handler}
 */
const validateToken = (options) => {
	return async function (req, res, next) {
		try {
			const jose = await getJose();

			// Extract JWT from header
			const token = req.headers[options.headerName];

			// Enforce token presence if configured
			if (options.enforceToken && !token) {
				return res.status(401).json({ error: `${options.headerName} not provided` });
			}

			// If no token is present and not enforcing, continue without verification
			if (!token) {
				return next();
			}

			// Fetch JWKS
			const cacheMaxAge = options.cacheMaxAgeSeconds ?? 3600;
			const jwks = await jose.createRemoteJWKSet(new URL(options.jwksUri), {
				cacheMaxAge: cacheMaxAge * 1000
			});
			const { payload } = await jose.jwtVerify(token, jwks);

			// attach decoded token to req object
			if (options.reqPropertyName) {
				req[options.reqPropertyName] = payload;
			}

			next();
		} catch (error) {
			console.error('validateToken Error:', error);
			return res.status(401).json({ error: 'Invalid token' });
		}
	};
};

module.exports = { validateToken };
