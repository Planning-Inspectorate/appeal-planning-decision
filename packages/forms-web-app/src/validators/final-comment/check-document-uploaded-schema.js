//todo: test

const schema = (path) => ({
	[path]: {
		custom: {
			options: async (value, { req }) => {
				//todo: can the key be passed in to make this schema reusable?
				const uploadedFiles = req.session.finalComment?.supportingDocuments?.uploadedFiles;

				if (!req.files) {
					if (uploadedFiles) {
						//at this stage, uploadedFiles will contain any files flagged for removal
						//so we need to disregard them when checking uploadedFiles
						if ('removedFiles' in req.body) {
							const removedFiles = JSON.parse(req.body.removedFiles);
							if (uploadedFiles.length - removedFiles.length < 1) {
								throw new Error('Select a file to upload');
							}
						}

						return true;
					}

					throw new Error('Select a file to upload');
				}

				return true;
			}
		}
	}
});

module.exports = schema;
