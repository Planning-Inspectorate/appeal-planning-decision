const { readdirSync, lstatSync } = require('fs');
const path = require('path');

/**
 * Recursively list folders from the given directory that include an index.js file
 *
 * @param {string} [directory]
 * @param {{ includeRoot?: boolean }} [options]
 * @returns {string[]}
 */
const getRoutePaths = (directory = __dirname, { includeRoot = false } = { includeRoot: false }) => {
	/** @type {string[]} */
	const paths = [];
	const entries = readdirSync(directory);
	for (const entry of entries) {
		const entryPath = path.join(directory, entry);
		const isDir = lstatSync(entryPath).isDirectory();

		if (isDir) {
			paths.push(...getRoutePaths(entryPath, { includeRoot: true }));
		} else if (entry === 'index.js' && includeRoot) {
			paths.push(directory);
		}
	}
	return paths;
};

/**
 * @param {(path: string) => { router: import('express').IRouter }} importFunc
 * @returns {(directory: string) => Object<string, import('express').IRouter>}
 */
const getRoutesWithInjectableImporter =
	(importFunc) =>
	(directory = __dirname) => {
		const routePaths = getRoutePaths(directory);
		/**
		 * @type {Object<string, import('express').IRouter>}
		 */
		const routes = {};

		for (const dirName of routePaths) {
			const { router } = importFunc(`${dirName}`);
			const relativePath = dirName
				.replace(directory, '') // just need relative path
				.replace(/_/g, ':') // need ':param' but Windows doesn't like ':' in folder names so we use '_param'
				.replace('/index.js', '');
			routes[relativePath] = router;
		}

		return routes;
	};

/**
 * @param {string} directory
 * @returns {Object<string, import('express').IRouter>}
 */
const getRoutes = getRoutesWithInjectableImporter(require);

module.exports = { getRoutePaths, getRoutesWithInjectableImporter, getRoutes };
