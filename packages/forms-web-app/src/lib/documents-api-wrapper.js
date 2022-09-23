const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const uuid = require('uuid');
const { documentTypes } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');

function isDataBuffer(data) {
	return data !== null && data !== undefined && typeof data === 'object';
}

function isTheFormDataBuffer(data) {
	return isDataBuffer(data) && data.tempFilePath;
}

const handler = async (url, method = 'GET', data = {}) => {
	const correlationId = uuid.v4();
	const logger = parentLogger.child({
		correlationId,
		service: 'Document Service API'
	});

	let apiResponse;

	try {
		apiResponse = await fetch(url, {
			method,
			headers: {
				'X-Correlation-ID': correlationId
			},
			...data
		});
	} catch (e) {
		logger.error(e);
		throw new Error(e.toString());
	}

	if (!apiResponse.ok) {
		logger.debug(apiResponse, 'Documents API Response not OK');
		throw new Error(apiResponse.statusText);
	}

	const ok = [200, 202].includes(await apiResponse.status);

	if (!ok) {
		throw new Error(apiResponse.statusText);
	}

	return apiResponse;
};

const createDocument = async (appeal, data, fileName, documentType, sectionTag = '') => {
	const body = new FormData();

	if (isTheFormDataBuffer(data)) {
		let documentName = fileName || data.name;
		documentName = documentName?.replace(
			/^/,
			`${sectionTag} - ${appeal.planningApplicationNumber} - `
		);
		body.append('file', fs.createReadStream(data.tempFilePath), documentName);
	} else if (isDataBuffer(data)) {
		fileName = fileName?.replace(/^/, `${sectionTag} - ${appeal.planningApplicationNumber} - `);
		body.append('file', data, fileName);
	} else {
		throw new Error('The type of provided data to create a document with is wrong');
	}

	//This is currently set to @documentTypes.name, which will never line up with the documentTypes mappings file, due to this using
	//documentTypes object in common to map this value to the display name will allow the values to match correctly
	const docType = documentTypes.documentType.displayName;
	body.append('documentType', docType);

	//If there is an associated GroupType for the documentType append this to the body
	if (documentTypes[documentType].groupType) {
		const documentGroupType = documentTypes[documentType].groupType;
		body.append('documentGroupType', documentGroupType);
	}

	const apiResponse = await handler(`${config.documents.url}/api/v1/${appeal.id}`, 'POST', {
		body
	});

	const response = await apiResponse.json();

	if (!response.id) {
		const msg = 'Document had no ID';
		throw new Error(msg);
	}

	return response;
};

const fetchDocument = (appealOrQuestionnaireId, documentId) =>
	handler(`${config.documents.url}/api/v1/${appealOrQuestionnaireId}/${documentId}/file`);

module.exports = {
	createDocument,
	fetchDocument
};
