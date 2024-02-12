const ApiError = require('#errors/apiError');
const Repo = require('./repo');

const repo = new Repo();

/**
 * @param {{ caseReference: string, userId: string, role: string }} params
 */
exports.get = async ({ caseReference, userId, role }) => {
	const data = await repo.get({ caseReference, userId, role });
	if (data) return data;
	throw ApiError.userNotFound();
};
