const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render(`comment-appeal/decided-appeals/index`);
});

module.exports = { router };
