module.exports = async () => {
	const { createMongoContainer } = require('./testcontainer-helpers/mongodb-container-helper');
	const { createAzuriteContainer } = require('./testcontainer-helpers/azurite-container-helper');
	await createMongoContainer();
	await createAzuriteContainer();

	process.env.FILE_MAX_SIZE_IN_BYTES = '4000'; // Just big enough for the ./test-files/sample.pdf
	process.env.FILE_UPLOAD_PATH = __dirname;
};
