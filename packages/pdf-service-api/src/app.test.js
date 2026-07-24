const supertest = require('supertest');

const chunkSize = 512;
const maxLength = 1 * chunkSize;
process.env.FILE_MAX_SIZE_IN_BYTES = String(maxLength);
const generatePdf = require('./lib/generatePdf');

const app = require('./app');

jest.mock('../src/lib/generatePdf'); // needs mocking as dependency on chromium/linux machine

describe('app', () => {
	describe('/', () => {
		it('should return 204', async () => {
			const response = await supertest(app).get('/');

			expect(response.status).toBe(204);
		});
	});

	describe('/health', () => {
		it('should provide health data', async () => {
			const response = await supertest(app).get('/health');

			expect(response.status).toBe(200);
			expect(response.body.status).toBe('OK');
		});
	});

	describe('POST /api/v1/generate', () => {
		it('should parse multipart form data and call postGeneratePdf with the correct data', async () => {
			const htmlContent = '<html><body></body></html>';

			const response = await supertest(app).post('/api/v1/generate').field('html', htmlContent);

			expect(generatePdf).toHaveBeenCalledWith(htmlContent);
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Buffer);
		});

		it('should error if request is too large', async () => {
			const chunk = 'x'.repeat(chunkSize);
			const chunks = ['<html><body>'];
			let currentSize = chunks[0].length + '</body></html>'.length;

			while (currentSize < maxLength + chunkSize) {
				chunks.push(chunk);
				currentSize += chunk.length;
			}

			chunks.push('</body></html>');

			const htmlContent = chunks.join('');

			const response = await supertest(app).post('/api/v1/generate').field('html', htmlContent);

			expect(response.status).toBe(500);
		});
	});
});
