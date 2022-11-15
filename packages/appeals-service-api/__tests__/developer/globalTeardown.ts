module.exports = async () => {
	const { destroyMongoContainer } = require('./mongodb-container-helper');

	await destroyMongoContainer();
};