const ApiError = require('#errors/apiError');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const Repo = require('./repo');
const caseService = require('../../../../appeal-cases/service');
const repo = new Repo();

/**
 * @param {{ caseReference: string, userId: string, role: string }} params
 */
exports.get = async ({ caseReference, userId, role }) => {
	if (role === LPA_USER_ROLE) {
		// handle LPA user, no explicit appeal <-> user link
		const data = await repo.getForLpaUser({ caseReference, userId });
		if (data) {
			return caseService.appendAppellant(data);
		}
	} else {
		// handle other users, with explicit appeal <-> user link
		const data = await repo.get({ caseReference, userId, role });
		if (data) return data;
	}
	throw ApiError.userNotFound();
};
