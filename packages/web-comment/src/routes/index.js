const { readdirSync, lstatSync } = require('fs');
const path = require('path');
// works line Next, urls come from dir names in routes director

/**
 * Recursively list folders from the given directory that include an index.js file
 *
 * @param {string} directory
 * @param {boolean} [includeRoot]
 * @returns {string[]}
 */
function getRoutes(directory = __dirname, includeRoot = false) {
	/** @type {string[]} */
	const paths = [];
	for (const entry of readdirSync(directory)) {
		const entryPath = path.join(directory, entry);
		const isDir = lstatSync(entryPath).isDirectory();

		if (isDir) {
			paths.push(...getRoutes(entryPath, true));
		} else if (entry === 'index.js' && includeRoot) {
			paths.push(directory);
		}
	}
	return paths;
}

const routePaths = getRoutes();
const routes = {};

for (const dirName of routePaths) {
	const { router } = require(`${dirName}`);
	const relativePath = dirName.replace(__dirname, '').replace('/index.js', '');
	routes[relativePath] = router;
}

module.exports = {
	routes
};

// YAGNI for now but upgrade this in a bit to handle nesting
// transparent dirnames would be cool too, in new Next they
// use a convention of (page-group-name) folders to ignore

/*
routes
|  top-level
|  |  index.js
|  (stuff)
|  |  thing-1
|  |  |  index.js
|  |  thing-2
|  |  | index.js
*/

// would make 3 pages, /top-level, /thing-1 and /thing-2

// I think we should just naturally inherit route params
// from express by just naming dirs like :reqParam
// that'll be nicer once the nesting is in place
