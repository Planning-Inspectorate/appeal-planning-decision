const path = require('path');
const request = require('supertest');
const express = require('express');
const { spoolRoutes } = require('./router-v2');

/** @type {Array<[string, Array<import('./router-v2-types').HttpMethods>]>} */
const expectedRouteDictShape = [
	['/', ['get', 'post']],
	['/drinks/2', ['get', 'delete', 'head', 'options', 'patch', 'post', 'put', 'trace']],
	['/drinks', ['get']],
	['/sandwiches/0', ['get']],
	['/sandwiches', ['get']],
	['/sandwiches/2/ingredients/1', ['get']]
];

describe('getRoutesV2', () => {
	const routeDirectory = path.join(__dirname, './router-v2-test-dir');
	const app = express();
	spoolRoutes(app, routeDirectory, { includeRoot: true });

	it('Creates a route dictionary given a root directory', async () => {
		for (const [path, methods] of expectedRouteDictShape) {
			for (const method of methods) {
				await request(app)[method](path).expect(200);
			}
		}
	});

	it("Doesn't create methods where none is specified", () => {
		request(app)
			.put('/')
			.expect(404)
			.end(() => {});
	});
});
