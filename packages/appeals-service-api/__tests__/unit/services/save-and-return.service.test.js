const _ = require('lodash');
const {
  createToken,
  saveAndReturnGetService,
  saveAndReturnNotify,
  saveAndReturnCreateService,
} = require('../../../src/services/save-and-return.service');
const mongodb = require('../../../src/db/db');

jest.mock('../../../src/db/db');

describe('save-and-return services', () => {
  describe('save-and-return token service', () => {
    it('should create token', () => {
      expect(createToken().toString()).toMatch(/\d{5}/);
    });

    describe('saveAndReturnGetService', () => {
      it('should retrieve saved appeal by appealId', async () => {
        const saved = {
          value: {
            appealId: '123445',
            token: null,
            email: 'asd@asd.com',
            createdAt: new Date(),
            expirerAt: null,
          },
        };
        mongodb.get = jest.fn(() => ({
          collection: jest.fn(() => ({
            findOne: jest.fn().mockResolvedValue(saved),
          })),
        }));

        const savedRes = await saveAndReturnGetService('12345');

        expect(savedRes).toEqual(saved.value);
      });

      it('should throw error', () => {
        mongodb.get = jest.fn(() => ({
          collection: jest.fn(() => ({
            findOne: jest.fn().mockRejectedValue(new Error('Some error')),
          })),
        }));

        expect(() => saveAndReturnGetService()).rejects.toThrowError('Some error');
      });
    });

    describe('saveAndReturnCreateService', () => {
      it('should save the appeal by appealId', async () => {
        const saved = {
          id: '123445',
          appealId: '123445',
          token: null,
          email: 'asd@asd.com',
          createdAt: new Date(),
          expirerAt: null,
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

        const savedRes = await saveAndReturnCreateService(saved);

        expect(savedRes).toEqual(saved.value);
      });
    });
    it('should throw error', () => {
      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          updateOne: jest.fn().mockRejectedValue(new Error('Some error')),
        })),
      }));

      expect(() => saveAndReturnCreateService()).rejects.toThrowError('Some error');
    });
  });

  describe(' save and return notify client', () => {
    it('should send notification with the template', () => {
      // TODO
      saveAndReturnNotify();
    });
  });
});
