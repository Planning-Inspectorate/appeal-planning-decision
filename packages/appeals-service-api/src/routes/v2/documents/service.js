const ApiError = require('#errors/apiError');
const Repo = require('./repo');
const repo = new Repo();
const { SchemaValidator } = require('../../../services/back-office-v2/validate');
const { getValidator } = new SchemaValidator();

/**
 * @typedef {import('@prisma/client').Document} PrismaDocument
 */

/**
 * @param {string} id
 * @returns {Promise<PrismaDocument>}
 */
exports.get = async (id) => {
	try {
		return await repo.get(id);
	} catch (error) {
		throw ApiError.documentDetailsNotFound(id);
	}
};

/**
 * @param {import('pins-data-model/src/schemas').AppealDocument} data
 * @returns {Promise<import('@prisma/client').Document>}
 */
exports.put = (data) => {
	const documentValidator = getValidator('appeal-document');
	if (!documentValidator(data)) {
		throw ApiError.badRequest('Document payload was invalid');
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
