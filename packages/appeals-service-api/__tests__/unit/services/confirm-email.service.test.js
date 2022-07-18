const {
	confirmEmailCreateService,
	confirmEmailGetService
} = require('../../../src/services/confirm-email.service');
const mongodb = require('../../../src/db/db');

jest.mock('../../../src/db/db');
jest.mock('../../../src/lib/notify');

describe('confirm-email services', () => {
	describe('confirmEmailGetService', () => {
		it('should retrieve saved data', async () => {
			const saved = { value: { appealId: '1234', createdAt: new Date() } };
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockResolvedValue(saved)
				}))
			}));

			const savedRes = await confirmEmailGetService('1234');

			expect(savedRes).toEqual(saved);
		});

		it('should throw error', () => {
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockRejectedValue(new Error('Some error'))
				}))
			}));

			expect(() => confirmEmailGetService('12345')).rejects.toThrowError('Some error');
		});
	});
	describe('confirmEmailCreateService', () => {
		it('should record data', async () => {
			const appeal = {
				id: '98765'
			};
			const saved = {
				appealId: '98765',
				createdAt: new Date()
			};
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					updateOne: jest.fn().mockResolvedValue()
				}))
			}));
			mongodb.get = jest.fn(() => ({
				collection: jest.fn(() => ({
					findOne: jest.fn().mockRejectedValue(saved)
				}))
			}));

			const result = await confirmEmailCreateService(appeal);

			expect(result).toEqual(saved.appealId);
		});
	});
	it('should throw error', () => {
		mongodb.get = jest.fn(() => ({
			collection: jest.fn(() => ({
				updateOne: jest.fn().mockRejectedValue(new Error('Some error'))
			}))
		}));

		expect(() => confirmEmailCreateService()).rejects.toThrowError('Some error');
	});
});
