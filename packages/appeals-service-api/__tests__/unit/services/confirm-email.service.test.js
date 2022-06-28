const { confirmEmailCreateService } = require('../../../src/services/confirm-email.service');
const mongodb = require('../../../src/db/db');
const { createToken, sendConfirmEmailAddressEmail } = require('../../../src/lib/notify');

jest.mock('../../../src/db/db');
jest.mock('../../../src/lib/notify');

describe('confirm-email services', () => {
  describe('confirmEmailCreateService', () => {
    it('should record token and date', async () => {
      const saved = {
        id: '123456',
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

      const token = await confirmEmailCreateService(saved);

      expect(token).toEqual(saved.token);
    });
  });
  it('should throw error', () => {
    mongodb.get = jest.fn(() => ({
      collection: jest.fn(() => ({
        updateOne: jest.fn().mockRejectedValue(new Error('Some error')),
      })),
    }));

    expect(() => confirmEmailCreateService()).rejects.toThrowError('Some error');
  });
});
