const { BlobServiceClient } = require('@azure/storage-blob');
const supertest = require('supertest');
const app = require('../../src/main');
const http = require('http')

jest.mock('mongoose', () => {
	// Auto-mocking isn't quite right on the virtual - doesn't return "get"
	return {
		model: jest.fn(),
		Schema: jest.fn(),
		DocumentsSchema: { index: jest.fn()}
	};
});

const mongoose = require('mongoose');

// mongoose.Schema.mockImplementation(() => ({
// 	index: jest.fn(),
// 	loadClass: jest.fn(),
// 	set: jest.fn(),
// 	virtual: virtualMock
// }));

//@TODO add feature flag here
// if (true) {
	let request;
	const applicationId = 'be046963-6cdd-4958-bd58-11be56304329';
	const documentId = '72c188c7-d034-48a9-b712-c94a1c571f9d';

	// const mockGetContainerClient = {
	// 	createIfNotExists: () => true
	// };

	// jest.mock('@azure/storage-blob', () => ({
	// 	BlobServiceClient: {
	// 		fromConnectionString: () => ({
	// 			getContainerClient: () => mockGetContainerClient
	// 		})
	// 	}
	// }));

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

			//When -> Someone uploads doc 
			// const result = await request.post('/api/v1/12345').send(fileOne)
			const result = await request.get('/test')
			console.log(result)
		})
		// it('Then', async () => {

		// })
		//Then -> Response should be as expected 
		//
	}) 
// }

