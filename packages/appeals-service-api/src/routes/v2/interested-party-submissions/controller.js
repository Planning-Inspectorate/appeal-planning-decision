const { createInterestedPartySubmission } = require('./service');
const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const ipSubmissionData = req.body;

		const submission = await createInterestedPartySubmission(ipSubmissionData);

		await backOfficeV2Service.submitInterestedPartySubmission(submission);

		res.status(200).send(submission);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitIpComment();
	}
};
