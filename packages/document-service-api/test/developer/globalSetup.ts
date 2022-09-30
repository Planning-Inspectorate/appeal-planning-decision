module.exports = async () => {
	const { createMongoContainer } = require('./mongodb-container-helper');
	const { createAzuriteContainer } = require('./azurite-container-helper');
	await createMongoContainer();
	await createAzuriteContainer();
};
