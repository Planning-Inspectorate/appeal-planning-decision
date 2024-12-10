const dotenv = require('dotenv');
dotenv.config(); // load from .env
const config = require('../src/configuration/config');
const blobClient = require('#lib/back-office-storage-client');
const fs = require('fs');

const uploadExample = async () => {
	const readStream = fs.createReadStream('./dev/example.txt');
	const result = await blobClient.uploadBlob(
		config.boStorage.container,
		'example.txt',
		{},
		readStream
	);
	return result.contentMD5;
};

uploadExample()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});
