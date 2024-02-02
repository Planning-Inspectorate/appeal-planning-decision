/** @type {import('express').RequestHandler} */
const appeals = async (req, res) => {
	res.render(`appeals/_id/index`, { id: req.params.id });
};

module.exports = { appeals };
