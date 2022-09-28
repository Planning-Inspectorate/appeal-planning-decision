module.exports = async () => {
	const {
		createMongoContainer,
		destroyMongoContainer,
		containerNotSpunUp
	} = require('./mongodb-container-helper');
	
	await createMongoContainer();
};