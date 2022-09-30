module.exports = async () => {
	const { destroyMongoContainer } = require('./mongodb-container-helper');
	const { destroyAzuriteContainer } = require('./azurite-container-helper');
	await destroyMongoContainer();
	await destroyAzuriteContainer();
};
