const Repo = require('./repo');

const repo = new Repo();

/**
 * @param {import('pins-data-model/src/schemas').AppealDocument} data
 * @returns {Promise<void>}
 */
exports.put = (data) => {
	return repo.put(data);
};
