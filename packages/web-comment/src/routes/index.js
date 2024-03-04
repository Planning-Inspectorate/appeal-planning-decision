const express = require('express');
const router = express.Router();

/** @type {import('express').RequestHandler} */
router.get('/', (_, res) => {
	res.redirect('/enter-appeal-reference');
});

const { getRoutes } = require('@pins/common');

const routes = getRoutes(__dirname);
routes['/'] = router;

module.exports = { routes };
