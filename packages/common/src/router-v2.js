const { getRoutePaths } = require('./router');
const { Router } = require('express');

/** @type {Array<import('./router-v2-types').HttpMethods>} */
const HttpMethods = [
	'connect',
	'delete',
	'get',
	'head',
	'options',
	'patch',
	'post',
	'put',
	'trace'
];

/**
 * @typedef {import('express').IRouter} IRouter
 * @typedef {Object<string, IRouter>} RouteDict
 */

/** @type {(str: *) => str is import('./router-v2-types').HttpMethods} */
const stringIsHttpMethod = (str) => HttpMethods.includes(str);

/**
 * @param {(path: string) => import('./router-v2-types').RouterModule} importFunc
 * @returns {(directory?: string, options?: { includeRoot?: boolean }) => RouteDict}
 */
exports.getRoutesWithInjectableImporter =
	(importFunc) =>
	(directory = __dirname, options) => {
		const routePaths = getRoutePaths(directory, options);
		/** @type RouteDict */
		const routes = {};

		for (const dirName of routePaths) {
			const router = Router();
			const module = importFunc(`${dirName}`);

			Object.entries(module).forEach((entry) => {
				if (!stringIsHttpMethod(entry[0])) {
					console.warn(
						`Skipping ${entry[0]} function exported by ${dirName}/index.js as the function name is not a recognised HTTP method.`
					);
					return;
				}
				router[entry[0]] = entry[1];
			});

			const relativePath = dirName
				.replace(new RegExp(`^${directory}/?`), '/') // just need relative path
				.replace(/_/g, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
				.replace('/index.js', '');
			routes[relativePath] = router;
		}

		return routes;
	};

exports.getRoutes = exports.getRoutesWithInjectableImporter(require);

/**
 * @param {import('express').Express} app
 * @param {string} [directory]
 * @param {{ includeRoot?: boolean }} [options]
 * @returns {void}
 */
exports.spoolRoutes = (app, directory, options) => {
	const routes = exports.getRoutes(directory, options);
	Object.entries(routes).forEach(([baseUrl, router]) => {
		app.use(baseUrl, router);
	});
};
