module.exports = async () => {
	const { destroyMongoContainer } = require('./testcontainer-helpers/mongodb-container-helper');
	const { destroyAzuriteContainer } = require('./testcontainer-helpers/azurite-container-helper');
	await destroyMongoContainer();
	await destroyAzuriteContainer();
};
