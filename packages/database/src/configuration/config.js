const config = {
	db: {
		sql: {
			// don't use the admin connection string for general use
			connectionString: process.env.SQL_CONNECTION_STRING
		}
	}
};

module.exports = config;
