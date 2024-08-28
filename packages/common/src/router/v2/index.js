const libLogger = require('../../lib/logger');
const { getRoutePaths } = require('../v1');
const { Router } = require('express');

/**
 * @typedef {Function} isPathEnabled
 * @param {string} directory
 * @returns {boolean}
 */

/**
 * @typedef {import('express').IRouter} IRouter
 * @typedef {import('express').Handler} Handler
 * @typedef {Object<string, IRouter>} RouteDict
 * @typedef {import('./types').HttpMethods} HttpMethods
 * @typedef {import('./types').RouterModule} RouterModule
 * @typedef {Object} Options
 * @property {boolean} Options.includeRoot default: `false`, Whether or not to register an `index.js` in the directory provided by the second argument.
 * @property {boolean} Options.backwardsCompatibilityModeEnabled default: `false`, Whether or not to register V1 style routes, see migrating from V1 in readme
 * @property {import('pino').Logger} Options.logger default: `pino`, a pre-configured logger instance
 * @property {isPathEnabled} Options.isPathEnabled default: `()=>true`, a function that checks if the current directory should be enabled or not, won't add the router if it returns false for that directory
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

/** @typedef {{ method: string, dirName: string }[]} UnrecognisedFunctions */
/** @typedef {{ path: string }[]} MethodlessRoutes */
/** @typedef {{ path: string }[]} DisabledRoutes */
/**
 * @typedef {{
 *   path: string,
 *   method: string,
 *   innerMiddleware?: Handler[] | undefined,
 *   outerMiddleware?: Handler[] | undefined,
 *   version: number
 * }[]} LoggableRoutes
 */
/** @typedef {{ dirName: string }[]} IgnoredV1Routes */
/**
 * @typedef {{
 *   unrecognisedFunctions: UnrecognisedFunctions,
 *   methodlessRoutes: MethodlessRoutes,
 *   loggableRoutes: LoggableRoutes,
 *   ignoredV1Routes: IgnoredV1Routes,
 * 	 disabledRoutes: DisabledRoutes
 * }} Loggables
 */

/**
 * @param {Loggables} loggables
 * @param {import('pino').Logger} logger
 */
const doLogging = (
	{ unrecognisedFunctions, methodlessRoutes, disabledRoutes, loggableRoutes, ignoredV1Routes },
	logger
) => {
	unrecognisedFunctions.length &&
		logger.warn(
			unrecognisedFunctions.reduce((acc, { method, dirName }, ii) => {
				acc += `Skipping ${method} function exported by ${dirName}/index.js as the function name is not a recognised HTTP method`;
				ii < unrecognisedFunctions.length - 1 && (acc += '\n');
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

	disabledRoutes.length &&
		logger.warn(
			disabledRoutes.reduce((acc, { path }, ii) => {
				acc += `Route disabled at ${path}`;
				ii < disabledRoutes.length - 1 && (acc += '\n');
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

	ignoredV1Routes.length &&
		logger.warn(
			ignoredV1Routes.reduce((acc, { dirName }) => {
				acc += `${dirName}\n`;
				return acc;
			}, 'The following files exported a router which has been ignored:\n') +
				'Migrate the functionality of these routers to meet the V2 spec or add backwardsCompatibilityModeEnabled: true to your spoolRoutes options'
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
		logger: libLogger,
		isPathEnabled: () => true
	}
) => {
	const {
		backwardsCompatibilityModeEnabled = false,
		logger = libLogger,
		isPathEnabled = () => true,
		...getRoutePathsOptions
	} = options;

	/** @type {Loggables} */
	const loggables = {
		unrecognisedFunctions: [],
		methodlessRoutes: [],
		disabledRoutes: [],
		loggableRoutes: [],
		ignoredV1Routes: []
	};

	const routePaths = getRoutePaths(directory, getRoutePathsOptions)
		// sorting ensures deeper routes are not overwritten by shallower routes
		.sort((a, b) => b.split('/').length - a.split('/').length)
		.reduce((router, dirName) => {
			/** @type {RouterModule} */
			const { middleware, ...module } = require(`${dirName}`);
			// Convert a full file path to the path used in the URL, eg C:/users/projects/my-project/routes/sandwiches/_id/index.js -> /sandwiches/:id
			const relativePath = dirName
				.replace(new RegExp(`^${directory}/?`), '/') // just need relative path
				.replace(/_/g, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
				.replace('/index.js', '');

			if (!isPathEnabled(relativePath)) {
				loggables.disabledRoutes.push({ path: relativePath });
				return router;
			}

			// apply top level middleware for all methods on the current path
			if (middleware?.[0]) {
				router.use(relativePath, ...middleware[0]);
			}

			// Loop through each item exported by a module
			Object.entries(module).forEach(([method, handler]) => {
				// Support for V1 style routers
				if (method === 'router') {
					if (!backwardsCompatibilityModeEnabled) {
						loggables.ignoredV1Routes.push({ dirName });
						return;
					}
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

				// Dismiss unexpected export names
				if (!stringIsRecognisedExport(method)) {
					loggables.unrecognisedFunctions.push({ method, dirName });
					return;
				}

				// Gather middleware specific to the current method
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
