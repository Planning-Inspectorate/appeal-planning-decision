const Repo = require('./repo');

const repo = new Repo();

/**
 * @param {import('pins-data-model/src/schemas').AppealEvent} data
 * @returns {Promise<import('@prisma/client').Event>}
 */
exports.put = (data) => {
	return repo.put(data);
};
