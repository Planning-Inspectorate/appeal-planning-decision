const { checkAuthTokens } = require('../../token-middleware');
const ApiError = require('#errors/apiError');
const { AppealCaseRepository } = require('../repo');
const { LPAQuestionnaireSubmissionRepository } = require('./lpa-questionnaire-submission/repo');

const caseRepo = new AppealCaseRepository();
const submissionRepo = new LPAQuestionnaireSubmissionRepository();

/**
 *
 * @param {Object} [options]
 * @param {boolean} [options.enforceUserLoggedIn]
 * @returns {import('express').Handler[]}
 */
function checkCaseAccess({ enforceUserLoggedIn = true } = {}) {
	return [
		...checkAuthTokens({ enforceUserLoggedIn }),
		...(enforceUserLoggedIn ? [assertCanAccessCase] : [])
	];
}

/**
 * @type {import('express').Handler}
 */
async function assertCanAccessCase(req, res, next) {
	try {
		const { caseReference } = req.params;
		const { lpaCode } = req.id_token || {};

		if (lpaCode) {
			await submissionRepo.lpaCanModifyCase({
				caseReference,
				userLpa: lpaCode
			});
			req.appealUserRoles = [];
		} else {
			const result = await caseRepo.userCanModifyCase({
				caseReference,
				userId: req.auth?.payload.sub
			});
			req.appealUserRoles = result.roles;
		}

		return next();
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.code || 500).send(error.message.errors);
		} else {
			return res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	checkCaseAccess
};
