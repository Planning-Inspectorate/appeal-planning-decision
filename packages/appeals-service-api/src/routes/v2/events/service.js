const ApiError = require('#errors/apiError');
const Repo = require('./repo');
const repo = new Repo();
const { SchemaValidator } = require('../../../services/back-office-v2/validate');
const { getValidator } = new SchemaValidator();

/**
 * @param {import('@planning-inspectorate/data-model/src/schemas').AppealEvent} data
 * @returns {Promise<import('@prisma/client').Event>}
 */
exports.put = (data) => {
	const eventValidator = getValidator('appeal-event');
	if (!eventValidator(data)) {
		throw ApiError.badRequest('Event payload was invalid');
	}

	return repo.put(data);
};

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
exports.delete = (id) => {
	return repo.delete(id);
};
