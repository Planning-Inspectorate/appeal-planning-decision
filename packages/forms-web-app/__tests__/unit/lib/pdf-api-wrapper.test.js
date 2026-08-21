const fetchMock = require('jest-fetch-mock');
const { gzipSync } = require('node:zlib');

fetchMock.enableMocks();

const { generatePDF } = require('../../../src/lib/pdf-api-wrapper');

describe('lib/pdf-api-wrapper', () => {
	describe('generatePDF', () => {
		const html = '<html><body><p>A test pdf</p></body></html>';

		beforeEach(() => {
			fetchMock.resetMocks();
		});

		it('should throw an error if the API request fails', async () => {
			fetchMock.mockRejectOnce(new Error('Internal Server Error'));
			await expect(generatePDF(html)).rejects.toThrow('Internal Server Error');
		});

		it('should throw an error if the API response is not ok', async () => {
			fetchMock.mockResponseOnce('fake response body', { status: 400 });
			await expect(generatePDF(html)).rejects.toThrow('Bad Request');
		});

		it('should throw an error if the API response status is not 200', async () => {
			fetchMock.mockResponseOnce('fake response body', { status: 401 });
			await expect(generatePDF(html)).rejects.toThrow('Unauthorized');
		});

		it('should return the pdf', async () => {
			fetchMock.mockResponseOnce('A pdf value', { status: 200 });

			const pdf = await generatePDF(html);

			expect(pdf).toEqual(Buffer.from('A pdf value'));
			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						accept: 'application/pdf',
						'content-encoding': 'gzip',
						'content-type': 'application/gzip'
					})
				})
			);

			const [, options] = fetchMock.mock.calls[0];
			expect(Buffer.from(options.body)).toEqual(gzipSync(html));
		});

		it('should return the pdf without gzip when disabled', async () => {
			fetchMock.mockResponseOnce('A pdf value', { status: 200 });

			const pdf = await generatePDF(html, { gzip: false });

			expect(pdf).toEqual(Buffer.from('A pdf value'));
			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						accept: 'application/pdf',
						'content-type': 'text/html; charset=utf-8'
					})
				})
			);

			const [, options] = fetchMock.mock.calls[0];
			expect(options.body).toBe(html);
		});
	});
});
