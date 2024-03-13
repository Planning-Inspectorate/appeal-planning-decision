const config = {
	db: {
		sql: {
			connectionString: process.env.SQL_CONNECTION_STRING
		}
	},
	storage: {
		boEndpoint: process.env.BO_DOCUMENTS_ENDPOINT
	}
};

module.exports = config;
