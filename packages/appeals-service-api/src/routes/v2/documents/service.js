const Repo = require('./repo');

const repo = new Repo();

/**
 * @param {import('pins-data-model/src/schemas').AppealDocument} data
 * @returns {Promise<import('@prisma/client').Document>}
 */
exports.put = (data) => {
	return repo.put(data);
};
