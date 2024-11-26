const getAzureBlobPathFromUri = (documentURI, blobHost, blobContainer) => {
	return documentURI.replace(`${blobHost}/${blobContainer}/`, '').replace(`${blobHost}/`, ''); // remove host if no container on url
};

module.exports = getAzureBlobPathFromUri;
