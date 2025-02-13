const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getLpaProofOfEvidenceByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const proofEvidence = await getLpaProofOfEvidenceByAppealId(req.params.caseReference);

		if (!proofEvidence) {
			throw ApiError.proofEvidenceNotFound();
		}

		const formatter = getFormatter(proofEvidence.AppealCase.appealTypeCode);
		await backOfficeV2Service.submitLpaProofEvidenceSubmission(req.params.caseReference, formatter);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitProofEvidenceResponse();
	}

	res.sendStatus(200);
};
