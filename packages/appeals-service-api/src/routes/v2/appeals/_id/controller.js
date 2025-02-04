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
	try {
		const data = req.body;
		const appeal = await patch({ appealId, data });

		if (!appeal) {
			res.status(404).send({ error: 'Appeal not found' });
			return;
		}

		res.send(appeal);
	} catch (error) {
		res.status(500).send({ error: 'Internal server error' });
	}
};
