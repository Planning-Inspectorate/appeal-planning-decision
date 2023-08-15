module.exports = () => {
	const sessionSecret = '03f50a8e-8eb6-42f9-b963-fde3f11f0535'; //Just a randomly generated GUID but could be anything

	if (!sessionSecret) {
		throw new Error('Session secret must be set');
	}



	const sessionConfig = {
		secret: sessionSecret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			sameSite: 'lax',
			httpOnly: true
		}
	};


	return sessionConfig;
};
