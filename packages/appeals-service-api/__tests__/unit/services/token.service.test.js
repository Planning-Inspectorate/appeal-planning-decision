jest.mock('../../../src/db/db');
jest.mock('../../../src/lib/token');

const {
	createOrUpdateTokenDocument,
	getTokenDocumentIfExists,
	getTokenCreatedAt
} = require('../../../src/services/token.service');
const mongodb = require('../../../src/db/db');
const { createToken } = require('../../../src/lib/token');

describe('services/token.service', () => {
	beforeEach(() => {
		jest.useFakeTimers('modern');
		jest.setSystemTime(Date.parse('2023-03-20T00:00:00Z'));
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.resetAllMocks();
	});

	describe('createOrUpdateTokenDocument', () => {
		beforeEach(() => {
			createToken.mockReturnValue('68736');

			mongodb.get = jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOneAndUpdate: jest.fn().mockReturnValue(true)
				})
			});
		});

		it('should call the expected functions', async () => {
			await createOrUpdateTokenDocument('e2813fb0-e269-4fe2-890e-6405dbd4a5ea', 'confirmEmail');

			expect(createToken).toBeCalled();
			expect(mongodb.get).toBeCalled();
			expect(mongodb.get().collection).toBeCalledWith('securityToken');
			expect(mongodb.get().collection().findOneAndUpdate).toBeCalledWith(
				{ _id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea' },
				{
					$set: {
						id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
						action: 'confirmEmail',
						attempts: 0,
						token: '68736',
						createdAt: new Date()
					}
				},
				{ upsert: true }
			);
		});

		it('should return token returned by createToken', async () => {
			const returnValue = await createOrUpdateTokenDocument('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');

			expect(returnValue).toBe('68736');
		});
	});

	describe('getTokenDocumentIfExists', () => {
		const retval = {
			value: {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				attempts: 2,
				action: 'test',
				createdAt: new Date()
			}
		};

		beforeEach(() => {
			createToken.mockReturnValue('68736');

			mongodb.get = jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOneAndUpdate: jest.fn().mockResolvedValue(retval)
				})
			});
		});

		it('should call the expected functions', async () => {
			await getTokenDocumentIfExists('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');

			expect(mongodb.get).toBeCalled();
			expect(mongodb.get().collection).toBeCalledWith('securityToken');
			expect(mongodb.get().collection().findOneAndUpdate).toBeCalledWith(
				{ _id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea' },
				{ $inc: { attempts: 1 } },
				{ returnOriginal: false }
			);
		});
		it('should return undefined if a matching token document was not found in the securityToken collection', async () => {
			mongodb.get = jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOneAndUpdate: jest.fn().mockResolvedValue(undefined)
				})
			});

			const returnValue = await getTokenDocumentIfExists('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');

			expect(returnValue).toBe(undefined);
		});
		it('should return the matching token document if it was found in the securityToken collection', async () => {
			const returnValue = await getTokenDocumentIfExists('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');
			expect(returnValue).toEqual(retval.value);
		});
	});

	describe('getTokenCreatedAt', () => {
		beforeEach(() => {
			mongodb.get = jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOne: jest.fn().mockResolvedValue({
						id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
						createdAt: new Date()
					})
				})
			});
		});

		it('should call the expected functions', async () => {
			await getTokenCreatedAt('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');

			expect(mongodb.get).toBeCalled();
			expect(mongodb.get().collection).toBeCalledWith('securityToken');
			expect(mongodb.get().collection().findOne).toBeCalledWith(
				{
					id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
				},
				{
					projection: {
						_id: 0,
						createdAt: 1
					}
				}
			);
		});
		it('should return undefined if no token createdAt date found in the securityToken collection for given ID', async () => {
			mongodb.get = jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOne: jest.fn().mockResolvedValue(null)
				})
			});

			const returnValue = await getTokenCreatedAt('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');

			expect(returnValue).toBe(undefined);
		});
		it('should return createdAt date for given ID if it was found in the securityToken collection', async () => {
			mongodb.get = jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOne: jest.fn().mockResolvedValue({ createdAt: '2023-03-20T00:00:00Z' })
				})
			});

			const returnValue = await getTokenCreatedAt('e2813fb0-e269-4fe2-890e-6405dbd4a5ea');

			expect(returnValue).toEqual('2023-03-20T00:00:00Z');
		});
	});
});
