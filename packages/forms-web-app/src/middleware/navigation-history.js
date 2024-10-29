const config = require('../config');

const defaultOptions = {
	fallbackPath: config.appeals.startingPoint,
	stackSize: 50
};

/**
 *
 * @param {{fallbackPath: string; stackSize: number }} options
 * @returns {import('express').Handler}
 */
module.exports =
	(options = defaultOptions) =>
	(req, _res, next) => {
		const activeOptions = {
			...defaultOptions,
			...options
		};

		if (
			!req.session ||
			(Object.keys(req.session).length === 1 && Object.hasOwn(req.session, 'cookie'))
		) {
			next();
			return;
		}

		if (!req.session.navigationHistory || !Array.isArray(req.session.navigationHistory)) {
			req.session.navigationHistory = [activeOptions.fallbackPath];
		}

		const currentPage = req.baseUrl + req.path;

		// prevent document links being added to nav history
		if (currentPage.includes('published-document')) {
			next();
			return;
		}

		// going forwards
		if (currentPage === req.session.navigationHistory[0]) {
			if (req.session.navigationHistory.length > 1) {
				req.session.navigationHistory = [
					currentPage,
					...req.session.navigationHistory.slice(1, activeOptions.stackSize - 1)
				];
			}

			next();
			return;
		}

		// going backwards
		if (currentPage === req.session.navigationHistory[1]) {
			req.session.navigationHistory = req.session.navigationHistory.slice(1);

			next();
			return;
		}

		req.session.navigationHistory = [
			currentPage,
			...req.session.navigationHistory.slice(0, activeOptions.stackSize - 1)
		];

		next();
	};
