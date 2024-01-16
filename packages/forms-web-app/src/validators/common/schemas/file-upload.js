const {
	fileUpload: {
		pins: { uploadApplicationMaxFileSize, allowedFileTypes },
		clamAVHost
	}
} = require('../../../config');
const validateFileSize = require('../../custom/file-size');
const ClamAVClient = require('@pins/common/src/client/clamav-rest-client');

const hasAlreadyUploadedFile = (task) => {
	const { uploadedFile = {}, uploadedFiles = [] } = task;
	return !!uploadedFile.id || (uploadedFiles[0] && !!uploadedFiles[0].id);
};

const schema = (noFilesError) => ({
	'file-upload': {
		custom: {
			options: async (value, { req, path }) => {
				const {
					files,
					session: { appeal },
					sectionName,
					taskName
				} = req;

				if (!files) {
					if (appeal[sectionName] && hasAlreadyUploadedFile(appeal[sectionName][taskName])) {
						return true;
					}

					throw new Error(noFilesError || 'Select a file to upload');
				}

				const uploadedFiles = !Array.isArray(files[path]) ? [files[path]] : files[path];
				const errorMsg = 'must be a DOC, DOCX, PDF, TIF, JPG or PNG';

				uploadedFiles.forEach(({ mimetype, name }) => {
					if (!Object.values(allowedFileTypes).includes(mimetype)) {
						throw new Error(`${name} ${errorMsg}`);
					}
				});

				// must validate file size *before* ClamAV check as otherwise axios will throw request body size error
				uploadedFiles.forEach(({ size, name }) => {
					validateFileSize(size, uploadApplicationMaxFileSize, name);
				});

				//check file for virus
				const { name } = req.files[path];
				const clamAVClient = new ClamAVClient(clamAVHost);
				await clamAVClient.scan(req.files['file-upload'], name, uploadApplicationMaxFileSize);

				return true;
			}
		}
	}
});

module.exports = schema;
