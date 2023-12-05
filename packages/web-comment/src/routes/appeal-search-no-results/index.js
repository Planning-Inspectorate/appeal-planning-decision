const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render(`appeal-search-no-results/index`, { appealReference: req.query.search });
});

module.exports = { router };
