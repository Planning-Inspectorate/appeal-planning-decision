const { PassThrough } = require('node:stream');
const buildZipFilename = require('#lib/build-zip-filename');

exports.get = () => {
	return async (req, res) => {
		const { appealNumber, appealCaseStage, documentsLocation } = req.params;

		if (!appealCaseStage) {
			return res.status(404);
		}

		res.setHeader('content-type', 'application/zip');
		res.setHeader(
			'content-disposition',
			`attachment; filename=${buildZipFilename(appealNumber, appealCaseStage)}`
		);

		const bufferStream = new PassThrough();

		bufferStream.end(
			await req.docsApiClient.getBulkDocumentsDownload(
				appealNumber,
				appealCaseStage,
				documentsLocation
			)
		);

		bufferStream.pipe(res);

		return res.status(200);
	};
};
