const libLogger = require('./lib/logger');
const { getRoutePaths } = require('./router');
const { Router } = require('express');

/**
 * @typedef {import('express').IRouter} IRouter
 * @typedef {import('express').Handler} Handler
 * @typedef {Object<string, IRouter>} RouteDict
 * @typedef {import('./router-v2-types').HttpMethods} HttpMethods
 * @typedef {import('./router-v2-types').RouterModule} RouterModule
 * @typedef {{ includeRoot?: boolean, backwardsCompatibilityModeEnabled?: boolean, logger?: import('pino').Logger }} Options
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

/** @typedef {{ method: string, dirName: string }[]} SkippedRoutes */
/** @typedef {{ path: string }[]} MethodlessRoutes */
/**
 * @typedef {{
 *   path: string,
 *   method: string,
 *   innerMiddleware?: Handler[] | undefined,
 *   outerMiddleware?: Handler[] | undefined,
 *   version: number
 * }[]} LoggableRoutes
 */
/**
 * @typedef {{
 *   skippedRoutes: SkippedRoutes,
 *   methodlessRoutes: MethodlessRoutes,
 *   loggableRoutes: LoggableRoutes,
 * }} Loggables
 */

/**
 * @param {Loggables} loggables
 * @param {import('pino').Logger} logger
 */
const doLogging = ({ skippedRoutes, methodlessRoutes, loggableRoutes }, logger) => {
	skippedRoutes.length &&
		logger.warn(
			skippedRoutes.reduce((acc, { method, dirName }, ii) => {
				acc += `Skipping ${method} function exported by ${dirName}/index.js as the function name is not a recognised HTTP method`;
				ii < skippedRoutes.length - 1 && (acc += '\n');
				return acc;
			}, '')
		);

	methodlessRoutes.length &&
		logger.warn(
			methodlessRoutes.reduce((acc, { path }, ii) => {
				acc += `No methods mounted on v1 route at ${path}`;
				ii < methodlessRoutes.length - 1 && (acc += '\n');
				return acc;
			}, '')
		);

	loggableRoutes.length &&
		logger.info(
			loggableRoutes.reduce(
				(acc, { path, method, innerMiddleware, outerMiddleware, version }, ii) => {
					acc += `${method} ${path} router version: ${version}`;
					// middleware isn't readable from v1 routes
					version !== 1 &&
						(acc += `, middleware: [${
							outerMiddleware?.map((fn) => fn.name ?? 'anonymous').join(', ') ?? ''
						}${outerMiddleware?.length && innerMiddleware?.length ? ', ' : ''}${
							innerMiddleware?.map((fn) => fn.name ?? 'anonymous').join(', ') ?? ''
						}]`);
					ii < loggableRoutes.length - 1 && (acc += '\n');
					return acc;
				},
				'Mounted route paths:\n'
			)
		);
};

/**
 * @param {string} [directory]
 * @param {Options} [options]
 * @returns {IRouter}
 */
exports.getRouter = (
	directory = __dirname,
	options = {
		includeRoot: false,
		backwardsCompatibilityModeEnabled: false,
		logger: libLogger
	}
) => {
	const {
		backwardsCompatibilityModeEnabled = false,
		logger = libLogger,
		...getRoutePathsOptions
	} = options;

	/** @type {Loggables} */
	const loggables = {
		skippedRoutes: [],
		methodlessRoutes: [],
		loggableRoutes: []
	};

	const routePaths = getRoutePaths(directory, getRoutePathsOptions)
		// sorting ensures deeper routes are not overwritten by shallower routes
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
					router.use(relativePath, handler); // in this instance "handler" is actually a router
					handler.stack.forEach((layer) => {
						if (!layer?.route?.methods) {
							loggables.methodlessRoutes.push({ path: relativePath });
							return;
						}

						Object.keys(layer.route.methods).forEach((method) => {
							loggables.loggableRoutes.push({
								path: relativePath,
								method,
								version: 1
							});
						});
					});
					return;
				}

				if (!stringIsRecognisedExport(method)) {
					// these all get logged after the loop
					loggables.skippedRoutes.push({ method, dirName });
					return;
				}

				/** @type {Handler[]} */
				let applicableMiddleware = [];

				if (!!middleware?.[1] && middleware[1][method]) {
					applicableMiddleware = middleware[1][method];
				}

				loggables.loggableRoutes.push({
					path: relativePath,
					method,
					innerMiddleware: middleware?.[1]?.[method],
					outerMiddleware: middleware?.[0],
					version: 2
				});

				router[method](relativePath, ...applicableMiddleware, handler);
			});

			return router;
		}, Router({ mergeParams: true }));

	doLogging(loggables, logger);

	return routePaths;
};
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
