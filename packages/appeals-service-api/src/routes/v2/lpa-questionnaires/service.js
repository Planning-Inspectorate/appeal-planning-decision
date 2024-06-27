const Repo = require('./repo');

const repo = new Repo();

/**
 * @param {import('pins-data-model').Schemas.LPAQuestionnaireCommand} data
 * @returns
 */
exports.put = (data) => {
	return repo.put(data);
};
