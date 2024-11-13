const { PassThrough } = require('node:stream');

const buildZipFilename = (appealNumber, appealCaseStage) => {
	const timestampTokens = new Date().toISOString().split('T');
	const dateString = timestampTokens[0].replaceAll('-', '');
	const timeString = timestampTokens[1].split('.')[0].replaceAll(':', '');
	return `appeal_${appealNumber}_${appealCaseStage}_${dateString}${timeString}.zip`;
};

exports.get = () => {
	return async (req, res) => {
		const { appealNumber, appealCaseStage } = req.params;

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
			await req.docsApiClient.getBackOfficeDocumentsByAppealNumberAndCaseStage(
				appealNumber,
				appealCaseStage
			)
		);

		bufferStream.pipe(res);

		return res.status(200);
	};
};
