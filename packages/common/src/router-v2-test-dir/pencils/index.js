const express = require('express');

const router = express.Router();

const pencils = Array(8)
	.fill(null)
	.map((_e, i) => i + 1 + 'H')
	.reverse()
	.concat(['F', 'HB'])
	.concat(
		Array(8)
			.fill(null)
			.map((_e, i) => i + 1 + 'B')
	);

router.get('/', (_req, res) => {
	res.send(pencils);
});

module.exports = {
	router,
	pencils
};
