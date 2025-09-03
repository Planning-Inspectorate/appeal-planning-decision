const monthMap = require('#lib/month-map');
/**
 * Middleware to combine individual day month and year inputs to a single string
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
	if (!req.body) return next();

	const dayInputs = Object.keys(req.body).filter((key) => key.match(/-(day)+$/));

	if (!dayInputs || !dayInputs.length) return next();

	dayInputs.forEach((input) => {
		const inputGroup = input.replace('-day', '');
		req.body[`${inputGroup}-day`] = req.body[`${inputGroup}-day`].trim();
		req.body[`${inputGroup}-month`] = req.body[`${inputGroup}-month`].trim();
		req.body[`${inputGroup}-year`] = req.body[`${inputGroup}-year`].trim();
		const monthNumber = monthMap[req.body[`${inputGroup}-month`].toLowerCase()];
		if (monthNumber) {
			req.body[`${inputGroup}-month`] = monthNumber;
		}
	});

	return next();
};
