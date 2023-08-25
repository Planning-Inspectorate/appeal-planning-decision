const logger = require('../lib/logger');
const AppealsCaseDataRepository = require('../repositories/appeals-case-data-repository');
const ApiError = require('../errors/apiError');

const appealsCaseDataRepository = new AppealsCaseDataRepository();

const getAppeals = async (lpaCode) => {
	if (!lpaCode) {
		throw ApiError.noLpaCodeProvided();
	}

	try {
		return await appealsCaseDataRepository.getAppeals(lpaCode);
	} catch (err) {
		logger.error(err);
		throw ApiError.appealsCaseDataNotFound();
	}
};

const getAppealByLpaCodeAndCaseRef = async (lpaCode, caseRef) => {
	if (!lpaCode) {
		throw ApiError.noLpaCodeProvided();
	}

	if (!caseRef) {
		throw ApiError.noCaseRefProvided();
	}

	try {
		return await appealsCaseDataRepository.getAppealByLpaCodeAndCaseRef(lpaCode, caseRef);
	} catch (err) {
		console.log(err);
		logger.error(err);
		throw ApiError.appealsCaseDataNotFound();
	}
};

const postAppealCaseData = async (caseData) => {
	if (!caseData || !caseData.lpaCode) {
		throw ApiError.badRequest();
	}

	await appealsCaseDataRepository.postAppealCaseData(caseData);
};
module.exports = {
	getAppeals,
	getAppealByLpaCodeAndCaseRef,
	postAppealCaseData
};
