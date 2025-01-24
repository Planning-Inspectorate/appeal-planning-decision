const ApiError = require('#errors/apiError');

const { AppealCaseRepository } = require('../repo');

const appealCaseRepo = new AppealCaseRepository();

/**
 * Middleware to check the user is rule 6 party who owns the submission record
 * @type {import('express').Handler}
 */
module.exports = async (req, res, next) => {
	try {
		await appealCaseRepo.rule6PartyCanModifyCase({
			caseReference: req.params.caseReference,
			userId: req.auth?.payload.sub
		});
		next();
	} catch (error) {
		if (error instanceof ApiError) {
			res.status(error.code || 500).send(error.errors);
		} else {
			res.status(500).send('An unexpected error occurred');
		}
	}
};
