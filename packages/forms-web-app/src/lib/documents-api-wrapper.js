const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const uuid = require('uuid');

const config = require('../config');
const parentLogger = require('./logger');

function isDataBuffer(data) {
	return data !== null && data !== undefined && typeof data === 'object';
}

function isTheFormDataBuffer(data) {
	return isDataBuffer(data) && data.tempFilePath;
}

const handler = async (url, method = 'GET', data = {}, localPlanningAuthorityCode = '') => {
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
				'local-planning-authority-code': localPlanningAuthorityCode
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

//todo test a fc and appeal submission to create document
const getCreateDocumentSubmissionData = (submission) => {
	//todo: refactor createDocument (and calls to it), so only required
	// submission data is sent and then remove this function

	//we don't have lpaCode on final comments so this defaults to STBC to allow
	//it past appeals-service-api feature flag (which is set to 100% LPAs)
	let submissionData = {
		id: submission.id,
		lpaCode: submission.lpaCode || 'E69999999',
		referenceNumber: null
	};

	if (submission?.appealType) {
		submissionData.referenceNumber = submission.planningApplicationNumber;
	}

	if (submission?.finalComment) {
		submissionData.referenceNumber = submission.horizonId;
	}

	return submissionData;
};

const createDocument = async (submission, data, fileName, documentType, sectionTag = '') => {
	const submissionData = getCreateDocumentSubmissionData(submission);

	const body = new FormData();

	if (isTheFormDataBuffer(data)) {
		let documentName = fileName || data.name;
		documentName = documentName?.replace(
			/^/,
			`${sectionTag} - ${submissionData.referenceNumber} - `
		);
		body.append('file', fs.createReadStream(data.tempFilePath), documentName);
	} else if (isDataBuffer(data)) {
		fileName = fileName?.replace(/^/, `${sectionTag} - ${submissionData.referenceNumber} - `);
		body.append('file', data, fileName);
	} else {
		throw new Error('The type of provided data to create a document with is wrong');
	}

	body.append('documentType', documentType);

	const apiResponse = await handler(
		`${config.documents.url}/api/v1/${submissionData.id}`,
		'POST',
		{
			body
		},
		submissionData.lpaCode //todo: this is only required for feature flag (horizon mapping) purposes
		// and can be removed when feature flag is removed
	);

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
