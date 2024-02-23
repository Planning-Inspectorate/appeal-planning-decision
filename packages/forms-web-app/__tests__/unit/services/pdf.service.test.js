const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const fetch = require('node-fetch');
const { storePdfAppeal, storeTextAsDocument } = require('../../../src/services/pdf.service');
const { getHtmlAppeal } = require('../../../src/services/pdf.service');
const { createDocument } = require('../../../src/lib/documents-api-wrapper');
const config = require('../../../src/config');
const { VIEW } = require('../../../src/lib/views');
const { CONSTS } = require('../../../src/consts');
const {
	VIEW: { FULL_APPEAL }
} = require('../../../src/lib/full-appeal/views');

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
	let htmlContent;
	let docType;
	let plainText;

	beforeEach(() => {
		mockAppeal = { id: 123 };
		docType = { displayName: 'test', name: 'test' };
		htmlContent = '<html><h1>Simple html file</h1></html>';
		plainText = 'simple plain text example';
		fetch.resetMocks();
	});

	describe('getHtmlAppeal', () => {
		it('should throw if fetch fails', async () => {
			fetch.mockReject(new Error('fake error message'));
			expect(getHtmlAppeal(mockAppeal)).rejects.toThrow('fake error message');
		});

		it('should throw if the remote API response is not ok', () => {
			fetch.mockResponse('fake response body', { status: 400 });
			expect(getHtmlAppeal(mockAppeal)).rejects.toThrow('Bad Request');
		});

		it('should throw if the response code is anything other than a 202', async () => {
			fetch.mockResponse('a response body', { status: 204 });
			expect(getHtmlAppeal(mockAppeal)).rejects.toThrow('No Content');
		});

		it('should return the expected response if the fetch status is 200 for appellant submission', async () => {
			fetch.mockResponse(htmlContent, { status: 200 });
			expect(await getHtmlAppeal(mockAppeal, 'test')).toEqual(htmlContent);
			expect(fetch).toBeCalledWith(
				`${config.server.host}/${VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION}/${mockAppeal.id}`,
				{ headers: { cookie: 'connect.sid=test' } }
			);
		});

		it('should return the expected response if the fetch status is 200 for full appeal', async () => {
			const fullAppeal = {
				...mockAppeal,
				appealType: APPEAL_ID.PLANNING_SECTION_78
			};
			fetch.mockResponse(htmlContent, { status: 200 });
			expect(await getHtmlAppeal(fullAppeal, 'test')).toEqual(htmlContent);
			expect(fetch).toHaveBeenCalledWith(
				`${config.server.host}/${FULL_APPEAL.DECLARATION_INFORMATION}/${fullAppeal.id}`,
				{
					headers: {
						cookie: `${CONSTS.SESSION_COOKIE_NAME}=test`
					}
				}
			);
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
	describe('storeTextAsDocument', () => {
		it('should throw if the create document API response is not ok', async () => {
			fetch.mockResponse(plainText, { status: 200 });
			createDocument.mockImplementation(() => Promise.reject(new Error()));
			try {
				await storeTextAsDocument(mockAppeal);
				expect('to be').not.toBe('to be');
			} catch (e) {
				expect(e.message).toBe('Error during the pdf generation');
			}
		});

		it('should return the expected response if no error were triggered fetch status is 200', async () => {
			await createDocument.mockResolvedValue({ data: [] });
			fetch.mockResponse(plainText, { status: 200 });
			expect(await storeTextAsDocument(mockAppeal, plainText, docType)).toEqual({ data: [] });
		});
	});
});
