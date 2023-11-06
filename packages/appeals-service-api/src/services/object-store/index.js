const config = require('../../configuration/config');

const blobMetaGetter = (initContainerClient) => {
	const containerClient = initContainerClient(config);
	return (location) =>
		new Promise((resolve) => {
			containerClient.then((containerClient) => {
				const blobClient = containerClient.getBlobClient(location);
				resolve(blobClient.getProperties());
			});
		});
};
module.exports = {
	blobMetaGetter
};
