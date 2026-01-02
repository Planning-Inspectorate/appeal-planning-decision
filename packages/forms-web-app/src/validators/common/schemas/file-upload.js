const {
	fileUpload: {
		pins: { maxFileUploadSize, allowedFileTypes }
	}
} = require('../../../config');
const validateFileSize = require('../../custom/file-size');
const getClamAVClient = require('#lib/clam-av-client-get');

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
				const errorMsg = 'must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX';

				uploadedFiles.forEach(({ mimetype, name }) => {
					if (!Object.values(allowedFileTypes).includes(mimetype)) {
						throw new Error(`${name} ${errorMsg}`);
					}
				});

				uploadedFiles.forEach(({ size, name }) => {
					validateFileSize(size, maxFileUploadSize, name);
				});

				//check file for virus
				const { name } = req.files[path];
				const clamAVClient = getClamAVClient();
				await clamAVClient.scan(req.files['file-upload'], name);

				return true;
			}
		}
	}
});

module.exports = schema;
