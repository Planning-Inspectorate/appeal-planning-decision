const { postGeneratePdf } = require('./pdf');
const generatePdf = require('../lib/generatePdf');
const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/generatePdf');

describe('controllers/pdf', () => {
	const res = mockRes();
	const html = '<html><body><p>A test pdf</p></body></html>';
	const pdfBuffer = Buffer.from(html);

	let req;

	beforeEach(() => {
		req = {
			...mockReq,
			body: Buffer.from(html),
			headers: {
				...mockReq.headers,
				'content-length': String(Buffer.byteLength(html))
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('postGeneratePdf', () => {
		it('should return a pdf when a pdf is generated successfully', async () => {
			generatePdf.mockReturnValue(pdfBuffer);

			await postGeneratePdf(req, res);

			expect(generatePdf).toHaveBeenCalledTimes(1);
			expect(generatePdf).toHaveBeenCalledWith(html);
			expect(res.contentType).toHaveBeenCalledTimes(1);
			expect(res.contentType).toHaveBeenCalledWith('application/pdf');
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith(pdfBuffer);
		});

		it('should handle no content length header', async () => {
			generatePdf.mockReturnValue(pdfBuffer);

			await postGeneratePdf(
				{
					...mockReq,
					body: Buffer.from(html),
					headers: {
						...mockReq.headers
					}
				},
				res
			);

			expect(generatePdf).toHaveBeenCalledTimes(1);
			expect(generatePdf).toHaveBeenCalledWith(html);
			expect(res.contentType).toHaveBeenCalledTimes(1);
			expect(res.contentType).toHaveBeenCalledWith('application/pdf');
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith(pdfBuffer);
		});

		it('should error with unknown data type', async () => {
			generatePdf.mockReturnValue(pdfBuffer);

			await postGeneratePdf(
				{
					...mockReq,
					body: 'a',
					headers: {
						...mockReq.headers,
						'content-length': 100
					}
				},
				res
			);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Expected body to be a Buffer, but got string'
			});
		});

		it('should return an error when an error is thrown generating a pdf', async () => {
			generatePdf.mockImplementation(() => {
				throw new Error('Internal Server Error');
			});

			await postGeneratePdf(req, res);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Internal Server Error'
			});
		});

		it('should handle unexpected error', async () => {
			generatePdf.mockImplementation(() => {
				throw 'Internal Server Error';
			});

			await postGeneratePdf(req, res);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledWith({
				message: 'Internal Server Error'
			});
		});
	});
});
