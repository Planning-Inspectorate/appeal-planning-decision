const fetch = require('node-fetch');
const FormData = require('form-data');
const { randomUUID } = require('node:crypto');

const config = require('../config');
const parentLogger = require('./logger');

exports.generatePDF = async (htmlContent) => {
	const path = '/api/v1/generate';

	const correlationId = randomUUID();
	const url = `${config.pdf.url}${path}`;

	const logger = parentLogger.child({
		correlationId,
		service: 'PDF Service API'
	});

	let apiResponse;
	try {
		const fd = new FormData();
		fd.append('html', htmlContent);

		apiResponse = await fetch(url, {
			method: 'POST',
			responseType: 'application/pdf',
			body: fd
		});
	} catch (e) {
		logger.error(e);
		throw new Error(e.toString());
	}

	if (!apiResponse.ok) {
		logger.debug(apiResponse, 'PDF API Response not OK');
		throw new Error(apiResponse.statusText);
	}

	const ok = (await apiResponse.status) === 200;

	if (!ok) {
		throw new Error(apiResponse.statusText);
	}

	return apiResponse.buffer();
};
