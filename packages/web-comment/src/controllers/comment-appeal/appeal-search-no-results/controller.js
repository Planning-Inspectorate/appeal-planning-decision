const appealSearchNoResults = async (req, res) => {
	res.render(`comment-appeal/appeal-search-no-results/index`, {
		appealReference: req.query.search
	});
};

module.exports = { appealSearchNoResults };
