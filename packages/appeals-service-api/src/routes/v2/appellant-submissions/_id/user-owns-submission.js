const ApiError = require('#errors/apiError');

const Repo = require('../repo');

const submissionRepo = new Repo();

/**
 * Middleware to check the user owns the appellant submission record
 * @type {import('express').Handler}
 */
module.exports = async (req, res, next) => {
	try {
		await submissionRepo.userOwnsAppealSubmission({
			appellantSubmissionId: req.params.id,
			userId: req.auth.payload.sub
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
