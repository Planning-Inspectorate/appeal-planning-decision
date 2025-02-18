const { createInterestedPartySubmission } = require('./service');
const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../services/back-office-v2');
const { getFormatter } = require('../appeal-cases/_caseReference/get-representation-formatter');

const backOfficeV2Service = new BackOfficeV2Service();

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const ipSubmissionData = req.body;

		const submission = await createInterestedPartySubmission(ipSubmissionData);

		if (!submission) {
			throw ApiError.unableToCreateAndFindIpComment();
		}

		const formatter = getFormatter(submission.AppealCase.appealTypeCode);

		await backOfficeV2Service.submitInterestedPartySubmission(submission, formatter);

		res.status(200).send(submission);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitIpComment();
	}
};
