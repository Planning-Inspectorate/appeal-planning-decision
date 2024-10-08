const path = require('path');
const request = require('supertest');
const express = require('express');
const { spoolRoutes } = require('.');
const { pencils } = require('./test-dir/pencils');
const {
	broadMiddlewareA,
	broadMiddlewareB,
	specificMiddlewareA,
	specificMiddlewareB
} = require('./test-dir/middleware');

jest.mock('./test-dir/middleware', () => ({
	broadMiddlewareA: jest.fn((_req, _res, next) => next()),
	broadMiddlewareB: jest.fn((_req, _res, next) => next()),
	specificMiddlewareA: jest.fn((_req, _res, next) => next()),
	specificMiddlewareB: jest.fn((_req, _res, next) => next())
}));

/** @type {Array<[string, Array<import('./types').HttpMethods>]>} */
const expectedRouteDictShape = [
	['/', ['get', 'post']],
	['/drinks/2', ['get', 'delete', 'head', 'options', 'patch', 'post', 'put', 'trace']],
	['/drinks', ['get']],
	['/sandwiches/0', ['get']],
	['/sandwiches', ['get']],
	['/sandwiches/2/ingredients/1', ['get']]
];

describe('getRoutesV2', () => {
	const routeDirectory = path.join(__dirname, './test-dir');
	const app = express();
	spoolRoutes(app, routeDirectory, {
		includeRoot: true,
		logger: { info: console.log, warn: console.warn },
		isPathEnabled: (dir) => !dir.startsWith('/not-live')
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Creates a route dictionary given a root directory', async () => {
		for (const [path, methods] of expectedRouteDictShape) {
			for (const method of methods) {
				await request(app)[method](path).expect(200);
			}
		}
	});

	it("Doesn't create methods where none is specified", async () => {
		await request(app).put('/').expect(404);
	});

	it("Doesn't create when path is disabled", async () => {
		await request(app).get('/not-live').expect(404);
	});

	it('Has a backwards compatibility mode to interop with router v1 modules', async () => {
		const backwardsCompatibleApp = express();
		spoolRoutes(backwardsCompatibleApp, routeDirectory, {
			includeRoot: true,
			backwardsCompatibilityModeEnabled: true,
			logger: { info: console.log, warn: console.warn }
		});

		const res = await request(backwardsCompatibleApp).get('/pencils');
		expect(JSON.parse(res.text)).toEqual(pencils);
	});

	it('invokes middleware', async () => {
		for (const [path, methods] of expectedRouteDictShape) {
			for (const method of methods) {
				await request(app)[method](path).expect(200);
			}
		}

		expect(broadMiddlewareA).toHaveBeenCalledTimes(8);
		expect(broadMiddlewareB).toHaveBeenCalledTimes(8);
		expect(specificMiddlewareA).toHaveBeenCalledTimes(2);
		// This one is only assigned to GET but we'll also expect it on HEAD
		expect(specificMiddlewareB).toHaveBeenCalledTimes(2);
	});
});
