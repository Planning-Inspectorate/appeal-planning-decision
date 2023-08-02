const {
	getAppeals,
	getAppealByLpaCodeAndCaseRef
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

module.exports = {
	getAppealsByLpaCode,
	getAppealByCaseRefAndLpaCode
};
