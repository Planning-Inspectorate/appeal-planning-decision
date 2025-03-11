const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getRule6ProofOfEvidenceByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	const userId = req.auth?.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const caseReference = req.params.caseReference;

	try {
		const proofEvidence = await getRule6ProofOfEvidenceByAppealId(userId, caseReference);

		if (!proofEvidence) {
			throw ApiError.proofEvidenceNotFound();
		}

		const formatter = getFormatter(proofEvidence.AppealCase.appealTypeCode);
		await backOfficeV2Service.submitRule6ProofOfEvidenceSubmission(
			caseReference,
			userId,
			formatter
		);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitProofEvidenceResponse();
	}

	res.sendStatus(200);
};
