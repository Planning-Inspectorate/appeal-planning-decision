const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render(`appeal-open-comment/index`);
});

module.exports = { router };
