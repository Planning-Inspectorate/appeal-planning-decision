const ApiError = require('#errors/apiError');
const { patch } = require('./service');

/**
 * @type {import('express').Handler}
 */
exports.patch = async (req, res) => {
	const appealId = req.params.id;

	if (!appealId) {
		throw ApiError.badRequest({ errors: ['Appeal id is required'] });
	}

	const data = req.body;

	const appeal = await patch({ appealId, data });

	res.send(appeal);
};
