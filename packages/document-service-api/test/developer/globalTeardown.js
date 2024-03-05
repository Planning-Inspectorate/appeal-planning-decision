module.exports = async () => {
	const { destroyAzuriteContainer } = require('./testcontainer-helpers/azurite-container-helper');
	await destroyAzuriteContainer();
};
