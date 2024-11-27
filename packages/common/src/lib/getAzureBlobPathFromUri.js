const trailingSlashRegex = /\/$/;

const getAzureBlobPathFromUri = (documentURI, blobHost, blobContainer) => {
	blobHost = blobHost.replace(trailingSlashRegex, '');
	return documentURI.replace(`${blobHost}/${blobContainer}/`, '').replace(`${blobHost}/`, ''); // remove host and container, or just host if container not present in url (legacy bug fix)
};

module.exports = getAzureBlobPathFromUri;
