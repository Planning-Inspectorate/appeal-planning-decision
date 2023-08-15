const express = require('express');
const { routerMock } = require('../../routerMock');

routerMock(express);

describe('../../../src/routes/users', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../src/routes/users');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});
	it('should load the correct routes', () => {
		expect(express.Router().get).toHaveBeenNthCalledWith(1, '/', expect.any(Function));
		expect(express.Router().get).toHaveBeenNthCalledWith(
			2,
			'/:id([a-f\\d]{24})',
			expect.any(Function)
		);
		expect(express.Router().post).toHaveBeenNthCalledWith(1, '/', expect.any(Function));
		expect(express.Router().delete).toHaveBeenNthCalledWith(1, '/:id', expect.any(Function));
		expect(express.Router().put).toHaveBeenNthCalledWith(1, '/:id/status', expect.any(Function));
	});
});
