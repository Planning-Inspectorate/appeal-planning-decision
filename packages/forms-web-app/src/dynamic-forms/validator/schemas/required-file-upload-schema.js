const schema = (path, journeyResponse, errorMsg = 'Select a file to upload') => ({
	[path]: {
		custom: {
			options: async (value, { req }) => {
				if (!req.files) {
					const uploadedFiles = journeyResponse.answers[path]?.uploadedFiles;

					if (uploadedFiles) {
						//at this stage, uploadedFiles will still contain any files flagged for removal
						//so we need to disregard them when checking uploadedFiles
						let removedFiles = [];

						if ('removedFiles' in req.body) {
							removedFiles = JSON.parse(req.body.removedFiles) || [];
						}

						if (uploadedFiles.length - removedFiles.length < 1) {
							throw new Error(errorMsg);
						}

						return true;
					}

					throw new Error(errorMsg);
				}

				return true;
			}
		}
	}
});

module.exports = schema;
