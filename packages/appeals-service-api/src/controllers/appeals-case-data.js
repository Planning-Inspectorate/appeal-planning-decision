const {
	getAppeals,
	getAppealByLpaCodeAndCaseRef,
	postAppealCaseData
} = require('../services/appeals-case-data.service');
const logger = require('../lib/logger');

const getAppealsByLpaCode = async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		body = await getAppeals(req.params.lpaCode);
	} catch (error) {
		logger.error(`Failed to get appeals: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
};

const getAppealByCaseRefAndLpaCode = async (req, res) => {
	let statusCode = 200;
	let body = {};
	const { lpaCode, caseRef } = req.params;
	try {
		body = await getAppealByLpaCodeAndCaseRef(lpaCode, caseRef);
	} catch (error) {
		logger.error(`Failed to get appeals: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
};

const postAppealCase = async (req, res) => {
	let statusCode = 201;
	const caseData = req.body;
	let body = {};

	try {
		body = await postAppealCaseData(caseData);
	} catch (error) {
		logger.error(`Failed to post appeal case data: ${error.code}`);
		statusCode = error.code;
	} finally {
		res.status(statusCode).send(body);
	}
};

module.exports = {
	getAppealsByLpaCode,
	getAppealByCaseRefAndLpaCode,
	postAppealCase
};
