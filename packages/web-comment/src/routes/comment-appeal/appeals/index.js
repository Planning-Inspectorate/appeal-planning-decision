const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render(`comment-appeal/appeals/index`, { postcode: req.query.search });
});

module.exports = { router };
