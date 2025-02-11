const ApiError = require('#errors/apiError');

const { LPAQuestionnaireSubmissionRepository } = require('./repo');

const submissionRepo = new LPAQuestionnaireSubmissionRepository();

/**
 * Middleware to check the user owns the appellant submission record
 * @type {import('express').Handler}
 */
module.exports = async (req, res, next) => {
	try {
		await submissionRepo.lpaCanModifyCase({
			caseReference: req.params.caseReference,
			userLpa: req.id_token.lpaCode
		});
		next();
	} catch (error) {
		if (error instanceof ApiError) {
			res.status(error.code).json(error.errors);
		} else {
			res.status(500).send('An unexpected error occurred');
		}
	}
};
