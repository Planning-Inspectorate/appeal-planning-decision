module.exports = async () => {
	const { createMongoContainer } = require('./mongodb-container-helper');

	await createMongoContainer();
};