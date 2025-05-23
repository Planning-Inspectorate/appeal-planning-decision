const { DocumentsRepository } = require('../../../../db/repos/repository');
const repo = new DocumentsRepository();

/**
 * @type {import('express').Handler}
 */
const checkCaseAccess = async (req, res, next) => {
	const { caseReference } = req.params ?? {};
	const id_token = req.id_token;
	const access_token = req.auth?.payload;

	if (!caseReference) {
		res.sendStatus(400);
		return;
	}

	const appealCase = await repo.getAppealCase({ caseReference });

	if (!appealCase) {
		res.sendStatus(404);
		return;
	}

	// if token has lpa code then an lpa user
	if (id_token.lpaCode === appealCase.LPACode) {
		res.locals.appealCase = appealCase;
		return next();
	}

	// if we have an lpa then it's the wrong one
	if (id_token.lpaCode) {
		res.sendStatus(401);
		return;
	}

	// Fetch user roles associated with the appeal
	const appealUserRoles = await repo.getAppealUserRoles({
		appealId: appealCase.appealId,
		userId: access_token.sub
	});

	// if no roles, user cannot access this document
	if (!appealUserRoles.length) {
		res.sendStatus(401);
		return;
	}

	// store appeal case and roles for any further checks
	res.locals.appealCase = appealCase;
	res.locals.appealUserRoles = appealUserRoles;

	return next();
};

module.exports = checkCaseAccess;
