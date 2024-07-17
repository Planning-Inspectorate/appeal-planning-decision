const { getRoutePaths } = require('./router');
const { Router } = require('express');

/**
 * @typedef {import('express').IRouter} IRouter
 * @typedef {import('express').Handler} Handler
 * @typedef {Object<string, IRouter>} RouteDict
 * @typedef {import('./router-v2-types').HttpMethods} HttpMethods
 * @typedef {import('./router-v2-types').RouterModule} RouterModule
 * @typedef {{ includeRoot?: boolean, backwardsCompatibilityModeEnabled?: boolean }} Options
 */

/** @type {Array<HttpMethods>} */
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

/** @type {(str: *) => str is HttpMethods} */
const stringIsRecognisedExport = (str) => HttpMethods.includes(str);

/**
 * @param {string} [directory]
 * @param {Options} [options]
 * @returns {IRouter}
 */
exports.getRouter = (
	directory = __dirname,
	{ backwardsCompatibilityModeEnabled = false, ...options } = {
		includeRoot: false,
		backwardsCompatibilityModeEnabled: false
	}
) =>
	getRoutePaths(directory, options)
		.sort((a, b) => b.split('/').length - a.split('/').length)
		.reduce((router, dirName) => {
			/** @type {RouterModule} */
			const { middleware, ...module } = require(`${dirName}`);
			const relativePath = dirName
				.replace(new RegExp(`^${directory}/?`), '/') // just need relative path
				.replace(/_/g, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
				.replace('/index.js', '');

			if (middleware?.[0]) {
				router.use(relativePath, ...middleware[0]);
			}

			Object.entries(module).forEach(([method, handler]) => {
				if (backwardsCompatibilityModeEnabled && method === 'router') {
					router.use(relativePath, handler); // in this instance "handler" should actually be a router
					return;
				}
				if (!stringIsRecognisedExport(method)) {
					// console.warn(
					// 	`Skipping ${method} function exported by ${dirName}/index.js as the function name is not a recognised HTTP method.`
					// );
					return;
				}
				/** @type {Handler[]} */
				let applicableMiddleware = [];
				if (!!middleware?.[1] && middleware[1][method]) {
					applicableMiddleware = middleware[1][method];
				}
				router[method](relativePath, ...applicableMiddleware, handler);
			});

			return router;
		}, Router({ mergeParams: true }));

/**
 * @param {import('express').Express} app
 * @param {string} [directory]
 * @param {Options} [options]
 * @returns {void}
 */
exports.spoolRoutes = (app, directory, options) => {
	const router = exports.getRouter(directory, options);
	app.use(router);
};
