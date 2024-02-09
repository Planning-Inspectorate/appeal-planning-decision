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
 * @param {string} [directory]
 * @param {{ includeRoot?: boolean }} [options]
 * @returns {IRouter}
 */
exports.getRouter = (directory = __dirname, options) =>
	getRoutePaths(directory, options).reduce((router, dirName) => {
		Object.entries(require(`${dirName}`)).forEach(([method, handler]) => {
			if (!stringIsHttpMethod(method)) {
				console.warn(
					`Skipping ${method} function exported by ${dirName}/index.js as the function name is not a recognised HTTP method.`
				);
				return;
			}
			const relativePath = dirName
				.replace(new RegExp(`^${directory}/?`), '/') // just need relative path
				.replace(/_/g, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
				.replace('/index.js', '');
			router[method](relativePath, handler);
		});

		return router;
	}, Router());

/**
 * @param {import('express').Express} app
 * @param {string} [directory]
 * @param {{ includeRoot?: boolean }} [options]
 * @returns {void}
 */
exports.spoolRoutes = (app, directory, options) => {
	const router = exports.getRouter(directory, options);
	app.use(router);
};
