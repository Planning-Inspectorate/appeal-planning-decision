const supertest = require('supertest');
const app = require('../../src/server');
const http = require('http');

//@TODO add feature flag here
if (true) {
	let request;
	const applicationId = 'be046963-6cdd-4958-bd58-11be56304329';
	const documentId = '72c188c7-d034-48a9-b712-c94a1c571f9d';

    beforeAll(async () => {    
		let server = http.createServer(app);
		request = supertest(server);
	});

	describe('test', () => {
		it('when', async () => {
			// Given: a file
			const fileOne = {
				params: {},
				log: {
					debug: jest.fn(),
					info: jest.fn(),
					error: jest.fn(),
					warn: jest.fn()
				},
				query: {
					base64: 'false'
				},
				file: {
					mimetype: 'application/pdf',
					originalname: '',
					filename: 'document-one.pdf',
					size: 1000,
					id: '72c188c7-d034-48a9-b712-c94a1c571f9d',
					date: new Date().toISOString()
				}
			};

			req.file

			//When -> Someone uploads doc 
			await request.post('/api/v1/12345').send(fileOne)

		})
		//Then -> Response should be as expected 
		//
	}) 
}

