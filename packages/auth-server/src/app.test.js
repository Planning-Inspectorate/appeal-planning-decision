import supertest from 'supertest';
import app from './app.js';

describe('app basic routes', () => {
	const request = supertest(app);

	it('GET / returns 204', async () => {
		const res = await request.get('/');
		expect(res.status).toBe(204);
	});

	it('GET /favicon.ico returns 204', async () => {
		const res = await request.get('/favicon.ico');
		expect(res.status).toBe(204);
	});

	it('GET /health returns OK payload', async () => {
		const res = await request.get('/health').set('user-agent', 'AlwaysOn');
		expect(res.status).toBe(200);
		expect(res.body.status).toBe('OK');
		expect(typeof res.body.uptime).toBe('number');
		expect(typeof res.body.commit).toBe('string');
	});
});
