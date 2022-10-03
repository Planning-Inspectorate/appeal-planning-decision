module.exports = async () => {
	const { createMongoContainer } = require('./testcontainer-helpers/mongodb-container-helper');
	const { createAzuriteContainer } = require('./testcontainer-helpers/azurite-container-helper');
	await createMongoContainer();
	await createAzuriteContainer();
};
