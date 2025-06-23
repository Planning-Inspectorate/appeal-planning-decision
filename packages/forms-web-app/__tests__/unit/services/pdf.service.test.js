const fetch = require('node-fetch');
const { getHtml, storePdfAppeal } = require('../../../src/services/pdf.service');
const { createDocument } = require('../../../src/lib/documents-api-wrapper');

jest.mock('../../../src/lib/documents-api-wrapper');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
	child: () => ({
		debug: mockLogger,
		error: mockLogger,
		info: mockLogger,
		warn: mockLogger
	})
}));

jest.mock('uuid', () => ({
	v4: jest.fn(() => '123-abc-456-xyz')
}));

describe('services/pdf.service', () => {
	let mockAppeal;
	let id;
	let url;
	let cookieString;
	let htmlContent;

	beforeEach(() => {
		id = '123';
		mockAppeal = { id };
		url = '/mock/url';
		cookieString = "sid='test'";
		htmlContent = '<html><h1>Simple html file</h1></html>';
		fetch.resetMocks();
	});

	describe('getHtml', () => {
		it('should throw if fetch fails', async () => {
			fetch.mockReject(new Error('fake error message'));
			expect(getHtml(id, url, cookieString)).rejects.toThrow('fake error message');
		});

		it('should throw if the remote API response is not ok', () => {
			fetch.mockResponse('fake response body', { status: 400 });
			expect(getHtml(id, url, cookieString)).rejects.toThrow('Bad Request');
		});

		it('should throw if the response code is anything other than a 202', async () => {
			fetch.mockResponse('a response body', { status: 204 });
			expect(getHtml(id, url, cookieString)).rejects.toThrow('No Content');
		});

		it('should return the expected response if the fetch status is 200', async () => {
			fetch.mockResponse(htmlContent, { status: 200 });
			expect(await getHtml(id, url, cookieString)).toEqual(htmlContent);
			expect(fetch).toHaveBeenCalledWith(url, { headers: { cookie: cookieString } });
		});
	});

	describe('storePdfAppeal', () => {
		it('should throw if the get html appeal API response is not ok', async () => {
			fetch.mockResponse(htmlContent, { status: 400 });
			await createDocument.mockResolvedValue({ data: [] });
			try {
				await storePdfAppeal({ appeal: mockAppeal });
				expect('to be').not.toBe('to be');
			} catch (e) {
				expect(e.message).toBe('Error during the appeal pdf generation');
			}
		});

		it('should throw if the create document API response is not ok', async () => {
			fetch.mockResponse(htmlContent, { status: 200 });
			createDocument.mockImplementation(() => Promise.reject(new Error()));
			try {
				await storePdfAppeal({ appeal: mockAppeal });
				expect('to be').not.toBe('to be');
			} catch (e) {
				expect(e.message).toBe('Error during the appeal pdf generation');
			}
		});

		it('should return the expected response if no error were triggered fetch status is 200', async () => {
			await createDocument.mockResolvedValue({ data: [] });
			fetch.mockResponse(htmlContent, { status: 200 });
			expect(await storePdfAppeal({ appeal: mockAppeal })).toEqual({ data: [] });
		});
	});
});
