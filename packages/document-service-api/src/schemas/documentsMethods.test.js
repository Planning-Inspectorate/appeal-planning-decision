const DocumentsMethods = require('./documentsMethods');
const { downloadFile } = require('../lib/blobStorage');
const { initContainerClient } = require('@pins/common');

jest.mock('../lib/blobStorage');
jest.mock('@pins/common', () => ({
	...jest.requireActual('@pins/common'),
	initContainerClient: jest.fn()
}));

describe('Documents methods', () => {
	describe('#downloadFileBuffer', () => {
		it('should download a file buffer', async () => {
			const connection = 'some-connection';
			initContainerClient.mockResolvedValue(connection);

			const fileBuffer = Buffer.from('hello world');
			downloadFile.mockResolvedValue(fileBuffer);

			const location = 'some-location';
			const obj = new DocumentsMethods();
			obj.get = jest.fn().mockReturnValue(location);

			expect(await obj.downloadFileBuffer()).toBe(fileBuffer);

			expect(downloadFile).toHaveBeenCalledWith(location, connection);
		});
	});

	describe('#generateId', () => {
		it('should add a randomUUID', () => {
			const obj = new DocumentsMethods();
			obj.set = jest.fn();

			expect(obj.generateId()).toBe(obj);

			expect(obj.set).toHaveBeenCalledWith('id', expect.any(String));
		});
	});

	describe('#toDTO', () => {
		it('should return the DTO with an undefined _id', () => {
			const data = {
				_id: 'some-id',
				applicationId: 'some-app'
			};

			const obj = new DocumentsMethods();

			/* Default Mongoose method */
			obj.toObject = jest.fn().mockReturnValue(data);

			expect(obj.toDTO()).toEqual({
				...data,
				_id: undefined
			});
		});
	});
});
