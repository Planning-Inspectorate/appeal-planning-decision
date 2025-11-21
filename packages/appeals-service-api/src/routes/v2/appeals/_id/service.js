const { UserAppealsRepository } = require('../repo');
const repo = new UserAppealsRepository();

/**
 * @typedef {import('@pins/database/src/client').Appeal} Appeal
 */

/**
 * @param {{ appealId: string, data: Appeal }} params
 * @return {Promise<Appeal| null>}
 */
exports.patch = async ({ appealId, data }) => {
	const appeal = await repo.patch({ appealId, data });

	if (!appeal) {
		return null;
	}

	return appeal;
};
