const { getRoutePaths } = require('./router');
const { Router } = require('express');

/**
 * @typedef {import('express').IRouter} IRouter
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
const stringIsHttpMethod = (str) => HttpMethods.includes(str);

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
			console.log('🚀 ~ .reduce ~ dirName:', dirName);
			/** @type {RouterModule} */
			const module = require(`${dirName}`);
			Object.entries(module).forEach(([method, handler]) => {
				const relativePath = dirName
					.replace(new RegExp(`^${directory}/?`), '/') // just need relative path
					.replace(/_/g, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
					.replace('/index.js', '');
				if (backwardsCompatibilityModeEnabled && method === 'router') {
					router.use(relativePath, handler); // in this instance "handler" should actually be a router
					return;
				}
				if (!stringIsHttpMethod(method)) {
					console.warn(
						`Skipping ${method} function exported by ${dirName}/index.js as the function name is not a recognised HTTP method.`
					);
					return;
				}
				router[method](relativePath, handler);
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
