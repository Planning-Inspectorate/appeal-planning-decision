module.exports = () => {
	const { sessionSecret } = '12345678';

	if (!sessionSecret) {
		throw new Error('Session secret must be set');
	}



	const sessionConfig = {
		store:{},
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
