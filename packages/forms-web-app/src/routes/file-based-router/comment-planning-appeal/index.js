const express = require('express');

const router = express.Router();

/**
 * @type {import('express').RequestHandler}
 * catches any unhandled routes for /comment-planning-appeal and provides a 404 page with comment template
 */
router.use('/', (req, res) => {
	res.status(404).render('comment-planning-appeal/not-found');
});

module.exports = { router };
