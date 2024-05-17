const helmet = require('helmet');
const crypto = require('node:crypto');

// Google analytics :(
const scriptSrc = ['https://*.googletagmanager.com', 'https://*.google-analytics.com'];
const imgSrc = [
	'https://*.google-analytics.com',
	'https://*.analytics.google.com',
	'https://*.googletagmanager.com'
];
const connectSrc = [
	'https://*.google-analytics.com',
	'https://*.analytics.google.com',
	'https://*.googletagmanager.com'
];

const addCSPNonce = (req, res) => `'nonce-${res.locals.cspNonce}'`;

function configureCSP(app) {
	app.use((req, res, next) => {
		res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
		next();
	});

	app.use(
		helmet({
			xFrameOptions: { action: 'deny' },
			contentSecurityPolicy: {
				directives: {
					'script-src': ["'self'", ...scriptSrc, addCSPNonce],
					'style-src': ["'self'", addCSPNonce],
					'img-src': ["'self'", ...imgSrc],
					'connect-src': ["'self'", ...connectSrc]
				}
			}
		})
	);
}

module.exports = {
	configureCSP
};
