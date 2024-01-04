/** @type {import('express').RequestHandler} */
const appealSearchNoResults = async (req, res) => {
	res.render(`appeal-search-no-results/index`, {
		appealReference: req.query.search
	});
};

module.exports = { appealSearchNoResults };
