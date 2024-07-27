const { getRoutePaths, getRoutesWithInjectableImporter } = require('.');

jest.mock('fs', () => {
	const jsStub = "console.log('Hello World!');";
	const njkStub = '<h1>Hello World!</h1>';

	const dirs = {
		project: {
			'index.js': jsStub,
			'page-a': {
				'index.js': jsStub,
				'controller.js': jsStub,
				'index.njk': njkStub
			},
			'page-b': {
				'index.js': jsStub,
				'controller.js': jsStub,
				'index.njk': njkStub
			},
			'page-c': {
				'page-d': {
					'index.js': jsStub,
					'controller.js': jsStub,
					'index.njk': njkStub
				}
			},
			'page-e': {
				'page-f': {
					'page-g': {
						'index.js': jsStub,
						'controller.js': jsStub,
						'index.njk': njkStub
					}
				}
			},
			'page-h': {
				'index.js': jsStub,
				'controller.js': jsStub,
				'index.njk': njkStub,
				'page-i': {
					'index.js': jsStub,
					'controller.js': jsStub,
					'index.njk': njkStub
				}
			},
			'page-j': {
				'index.js': jsStub,
				'controller.js': jsStub,
				'index.njk': njkStub,
				'page-k': {
					'index.js': jsStub,
					'controller.js': jsStub,
					'index.njk': njkStub
				},
				'page-l': {
					'index.js': jsStub,
					'controller.js': jsStub,
					'index.njk': njkStub
				}
			}
		}
	};

	/**
	 * @typedef {{
	 *  [key: string]: string | Dirs
	 * }} Dirs
	 */

	/**
	 * @param {string} path
	 * @param {Dirs} obj
	 * @returns {string[]}
	 */
	const mockReaddirSync = (path, obj = dirs) => {
		if (!/\//.exec(path)) return Object.keys(obj[path]);
		const [next, ...rest] = path.split('/');
		// @ts-ignore
		return mockReaddirSync(rest.join('/'), obj[next]);
	};

	/**
	 * @param {string} path
	 * @returns {{ isDirectory: () => boolean }}
	 */
	const mockLstatSync = (path) => ({ isDirectory: () => !/(?:.js|.njk)$/.exec(path) });

	return {
		...jest.requireActual('fs'),
		readdirSync: mockReaddirSync,
		lstatSync: mockLstatSync
	};
});

describe('getRoutePaths', () => {
	it('gets route paths', () => {
		const routePaths = getRoutePaths('project');
		expect(routePaths).toEqual([
			'project/page-a',
			'project/page-b',
			'project/page-c/page-d',
			'project/page-e/page-f/page-g',
			'project/page-h',
			'project/page-h/page-i',
			'project/page-j',
			'project/page-j/page-k',
			'project/page-j/page-l'
		]);
	});
});

describe('getRoutes', () => {
	const getRoutes = getRoutesWithInjectableImporter(() => ({
		router: jest.fn()
	}));

	it('gets routes', () => {
		const routePaths = getRoutes('project');
		expect(routePaths).toEqual({
			'/page-a': expect.anything(),
			'/page-b': expect.anything(),
			'/page-c/page-d': expect.anything(),
			'/page-e/page-f/page-g': expect.anything(),
			'/page-h': expect.anything(),
			'/page-h/page-i': expect.anything(),
			'/page-j': expect.anything(),
			'/page-j/page-k': expect.anything(),
			'/page-j/page-l': expect.anything()
		});
	});
});
