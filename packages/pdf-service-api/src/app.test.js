const supertest = require('supertest');
const app = require('./app');

const generatePdf = require('./lib/generatePdf');
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
			const htmlContent = '<html><body><h1>Test PDF</h1></body></html>';

			const response = await supertest(app).post('/api/v1/generate').field('html', htmlContent);

			expect(generatePdf).toHaveBeenCalledWith(htmlContent);
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Buffer);
		});
	});
});
