const {
  confirmEmailCreateService,
  confirmEmailGetService,
} = require('../../../src/services/confirm-email.service');
const mongodb = require('../../../src/db/db');
const {
  createToken,
  sendSubmissionConfirmationEmailToAppellant,
} = require('../../../src/lib/notify');

jest.mock('../../../src/db/db');
jest.mock('../../../src/lib/notify');

describe('confirm-email services', () => {
  describe('confirmEmailService', () => {
    it('should retrieve saved token', async () => {
      const saved = { value: { token: '12345', createdAt: new Date() } };
      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          findOne: jest.fn().mockResolvedValue(saved),
        })),
      }));

      const savedRes = await confirmEmailGetService('12345');

      expect(savedRes).toEqual(saved);
    });

    it('should throw error', () => {
      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          findOne: jest.fn().mockRejectedValue(new Error('Some error')),
        })),
      }));

      expect(() => confirmEmailGetService('12345')).rejects.toThrowError('Some error');
    });
  });
  describe('confirmEmailCreateService', () => {
    it('should record token and date', async () => {
      const saved = {
        token: 12345,
        email: 'test@example.com',
        createdAt: new Date(),
      };
      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          updateOne: jest.fn().mockResolvedValue(),
        })),
      }));
      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          findOne: jest.fn().mockRejectedValue(saved),
        })),
      }));

      createToken.mockReturnValue(12345);

      const token = await confirmEmailCreateService();

      expect(token).toEqual(saved.token);
    });
  });
  it('should throw error', () => {
    const saved = {
      id: '123445',
      appealId: '123445',
      token: 12345,
      email: 'asd@asd.com',
      createdAt: new Date(),
    };
    mongodb.get = jest.fn(() => ({
      collection: jest.fn(() => ({
        updateOne: jest.fn().mockRejectedValue(new Error('Some error')),
      })),
    }));

    expect(() => confirmEmailCreateService()).rejects.toThrowError('Some error');
  });
});
