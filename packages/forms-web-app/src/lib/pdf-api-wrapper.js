const { gzipSync } = require('node:zlib');
const { minify } = require('html-minifier-terser');
const { randomUUID } = require('node:crypto');

const config = require('../config');
const parentLogger = require('./logger');

/**
 * @param {string} htmlContent
 * @param {{ gzip?: boolean }} [options]
 * @returns {Promise<Buffer>}
 */
exports.generatePDF = async (htmlContent, options = {}) => {
	const path = '/api/v1/generate';
	const { gzip = true } = options;

	const correlationId = randomUUID();
	const url = `${config.pdf.url}${path}`;

	const logger = parentLogger.child({
		correlationId,
		service: 'PDF Service API'
	});

	let apiResponse;
	try {
		/** @type {Record<string, string>} */
		const headers = {
			accept: 'application/pdf'
		};

		const minifiedHtml = await minify(htmlContent, {
			removeAttributeQuotes: true,
			html5: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			removeTagWhitespace: true,
			collapseWhitespace: true
		});

		const body = gzip ? gzipSync(minifiedHtml) : minifiedHtml;
		if (gzip) {
			headers['content-encoding'] = 'gzip';
			headers['content-type'] = 'application/gzip';
		} else {
			headers['content-type'] = 'text/html; charset=utf-8';
		}

		apiResponse = await fetch(url, {
			method: 'POST',
			headers,
			body
		});
	} catch (e) {
		const error = e instanceof Error ? e : new Error(String(e));
		logger.error(error);
		throw error;
	}

	if (!apiResponse.ok) {
		logger.debug(apiResponse, 'PDF API Response not OK');
		throw new Error(apiResponse.statusText);
	}

	if (apiResponse.status !== 200) {
		throw new Error(apiResponse.statusText);
	}

	return Buffer.from(await apiResponse.arrayBuffer());
};
