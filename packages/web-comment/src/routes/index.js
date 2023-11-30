const { readdirSync, lstatSync } = require('fs');
const path = require('path');

// works line Next, urls come from dir names in routes director

const dirNames = readdirSync(__dirname).filter((name) =>
	lstatSync(path.join(__dirname, name)).isDirectory()
);

/**
 * @type {Object<urlPath: string, router: import('express').IRouter>}
 */
const routes = dirNames.reduce((acc, dirName) => {
	const { router } = require(`./${dirName}`);
	return {
		...acc,
		[`/${dirName}`]: router
	};
}, {});

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
