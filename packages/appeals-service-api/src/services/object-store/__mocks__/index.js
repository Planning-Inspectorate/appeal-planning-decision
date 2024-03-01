module.exports = {
	blobMetaGetter() {
		return async () => ({
			lastModified: '2024-03-01T14:48:35.847Z',
			createdOn: '2024-03-01T13:48:35.847Z',
			metadata: { mime_type: 'image/jpeg' },
			size: 10293,
			_response: { request: { url: 'https://example.com' } }
		});
	}
};
