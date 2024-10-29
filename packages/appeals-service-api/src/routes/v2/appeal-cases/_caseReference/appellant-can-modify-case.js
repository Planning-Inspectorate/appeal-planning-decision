const ApiError = require('#errors/apiError');

const { AppealCaseRepository } = require('../repo');

const appealCaseRepo = new AppealCaseRepository();

/**
 * Middleware to check the user owns the appellant submission record
 * @type {import('express').Handler}
 */
module.exports = async (req, res, next) => {
	try {
		await appealCaseRepo.appellantCanModifyCase({
			caseReference: req.params.caseReference,
			userId: req.auth?.payload.sub
		});
		next();
	} catch (error) {
		if (error instanceof ApiError) {
			res.status(error.code || 500).send(error.message.errors);
		} else {
			res.status(500).send('An unexpected error occurred');
		}
	}
};
