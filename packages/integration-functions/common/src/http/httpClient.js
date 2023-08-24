//TODO re usable http client that can be used to contact either the front office or back offcie api's
const http = require('node:http');
const https = require('node:https');

const CONTENT_TYPE_JSON = 'application/json';
const HTTP_PROTOCOL = 'http';
const HTTPS_PROTOCOL = 'https';
const METHOD_GET = 'GET';
const METHOD_PUT = 'PUT';
const METHOD_POST = 'POST';
const ALLOWED_METHODS = ['GET', 'POST', 'PUT'];
const ALLOWED_CONTENT_TYPES = [
	'application/json',
	'application/pdf',
	'application/rtf',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.oasis.opendocument.text',
	'application/vnd.oasis.opendocument.spreadsheet',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword'
];

const optionsBuilder = (contentType = CONTENT_TYPE_JSON, json, method, urlObject) => {
	if (!ALLOWED_METHODS.includes(method.toLocaleUpperCase()))
		return Promise.reject(new Error(`Unsupported HTTP method '${method}'`));
	if (!ALLOWED_CONTENT_TYPES.includes(contentType.toLocaleLowerCase()))
		return Promise.reject(new Error(`Unsupported content mime type '${contentType}'`));

	return {
		protocol: urlObject.protocol.toLocaleLowerCase(),
		method: method,
		hostname: urlObject.hostname,
		port: urlObject.port,
		path: urlObject.pathname,
		headers: {
			'Content-Type': contentType,
			'Content-Length': Buffer.byteLength(json)
		}
	};
};

const httpsRequest = async (context, options) => {
	return new Promise((resolve, reject) => {
		try {
			const req = https
				.request(options, (res) => {
					let rawData = '';
					res.setEncoding('utf8');
					res.on('data', (chunk) => (rawData += chunk));
					res.on('end', () => {
						try {
							JSON.parse(rawData);
							resolve(rawData);
						} catch (e) {
							context.log(e);
							return Promise.reject(e);
						}
					});
				})
				.on('error', (e) => {
					context.log(e);
				});
			req.end();
		} catch (e) {
			reject(e);
		}
	});
};

const httpRequest = (context, options) => {
	return new Promise((resolve, reject) => {
		try {
			const req = http.request(options, (res) => {
				let rawData = '';
				res.setEncoding('utf8');
				res.on('data', (chunk) => (rawData += chunk));
				res.on('end', () => {
					try {
						JSON.parse(rawData);
						resolve(rawData);
					} catch (e) {
						context.log(e);
						return Promise.reject(e);
					}
				});
			});
			req.on('error', (e) => {
				context.log(e);
			});
			req.end();
		} catch (e) {
			reject(e);
		}
	});
};

const doRequest = async (context, options) => {
	let response = '';
	try {
		switch (options.protocol.replace(':', '')) {
			case HTTP_PROTOCOL:
				response = await httpRequest(context, options);
				return Promise.resolve(response);
			case HTTPS_PROTOCOL:
				response = await httpsRequest(context, options);
				return Promise.resolve(response);
			default:
				return Promise.reject(`Unsupported protocol ${options.protocol}`);
		}
	} catch (e) {
		return Promise.reject(e);
	}
};

const jsonRequest = async (context, json, method = METHOD_POST, url) => {
	const urlObject = new URL(url);
	try {
		json = typeof json === 'object' ? JSON.stringify(json) : json;
		const options = optionsBuilder(CONTENT_TYPE_JSON, json, method, urlObject);
		return Promise.resolve(await doRequest(context, options));
	} catch (e) {
		return Promise.reject(e);
	}
};

module.exports = {
	jsonRequest,
	METHOD_GET,
	METHOD_POST,
	METHOD_PUT
};
