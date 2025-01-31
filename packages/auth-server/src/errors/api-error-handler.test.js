import getApiErrorHandler from './api-error-handler.js';
import { jest } from '@jest/globals';

describe('getApiErrorHandler', () => {
	let logger;
	let errorHandler;
	let err;
	let req;
	let res;
	let next;

	beforeEach(() => {
		logger = {
			error: jest.fn()
		};
		errorHandler = getApiErrorHandler(logger);
		err = new Error('Test error');
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		next = jest.fn();
	});

	it('should log the error using the logger', () => {
		errorHandler(err, req, res, next);

		expect(logger.error).toHaveBeenCalledWith(err);
	});

	it('should send a 500 status code', () => {
		errorHandler(err, req, res, next);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it('should send a JSON response with an error message', () => {
		errorHandler(err, req, res, next);

		expect(res.json).toHaveBeenCalledWith(
			'Unexpected internal server error while handling API call'
		);
	});

	it('should not call next', () => {
		errorHandler(err, req, res, next);

		expect(next).not.toHaveBeenCalled();
	});
});
