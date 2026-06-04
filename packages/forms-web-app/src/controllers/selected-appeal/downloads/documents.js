const { PassThrough } = require('node:stream');
const buildZipFilename = require('#lib/build-zip-filename');

/** @type {function():import('express').RequestHandler} */
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

/** @type {function():import('express').RequestHandler} */
exports.getByType = () => {
	return async (req, res) => {
		const { appealNumber, documentsLocation } = req.params;
		const { filter } = req.query;

		if (!appealNumber || !documentsLocation || !filter) {
			return res.status(404);
		}

		res.setHeader('content-type', 'application/zip');
		res.setHeader('content-disposition', `attachment; filename=${buildZipFilename(appealNumber)}`);

		const bufferStream = new PassThrough();

		bufferStream.end(
			await req.docsApiClient.getBulkDocumentsDownloadByType(
				appealNumber,
				documentsLocation,
				filter
			)
		);

		bufferStream.pipe(res);

		return res.status(200);
	};
};
