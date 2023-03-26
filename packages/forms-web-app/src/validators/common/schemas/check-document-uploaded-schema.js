const { findTargetValueInJSON } = require('../../../lib/find-target-value-in-json');

const schema = (path, documentType, submissionType) => ({
	[path]: {
		custom: {
			options: async (value, { req }) => {
				if (!req.files) {
					let uploadedFiles;

					if (req.session[submissionType]) {
						uploadedFiles = findTargetValueInJSON(
							req.session[submissionType],
							documentType
						).uploadedFiles;
					}
					if (uploadedFiles) {
						//at this stage, uploadedFiles will still contain files flagged for removal
						//so we need to disregard them when checking uploadedFiles
						if ('removedFiles' in req.body) {
							const removedFiles = JSON.parse(req.body.removedFiles) || [];
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
