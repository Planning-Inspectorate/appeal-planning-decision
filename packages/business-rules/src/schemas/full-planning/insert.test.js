const v8 = require('v8');
const appealData = require('../../../test/data/full-planning');
const insert = require('./insert');
const { APPEAL_STATE, APPEAL_ID, TYPE_OF_PLANNING_APPLICATION } = require('../../constants');

describe('schemas/full-planning/insert', () => {
  const config = {};

  let appeal;
  let appeal2;

  beforeEach(() => {
    appeal = v8.deserialize(v8.serialize(appealData));
    appeal2 = v8.deserialize(v8.serialize(appealData));
  });

  describe('insert', () => {
    it('should return the data when given valid data', async () => {
      const result = await insert.validate(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should remove unknown fields', async () => {
      appeal2.unknownField = 'unknown field';

      const result = await insert.validate(appeal2, config);
      expect(result).toEqual(appeal);
    });

    describe('id', () => {
      it('should throw an error when not given a UUID', async () => {
        appeal.id = 'abc123';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'id must be a valid UUID',
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.id = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'id must be a `string` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.id;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'id is a required field',
        );
      });
    });

    describe('horizonId', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.horizonId = 'a'.repeat(21);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'horizonId must be at most 20 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.horizonId = '  abc123  ';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          horizonId: 'abc123',
        });
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.horizonId;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('lpaCode', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.lpaCode = 'a'.repeat(21);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'lpaCode must be at most 20 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.lpaCode = '  abc123  ';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          lpaCode: 'abc123',
        });
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.lpaCode;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('state', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.state = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `state must be one of the following values: ${Object.values(APPEAL_STATE).join(', ')}`,
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.state = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'state must be a `string` type, but the final value was: `null`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal2.state;

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual({
          ...appeal,
          state: 'DRAFT',
        });
      });
    });

    describe('appealType', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.appealType = '0001';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `appealType must be one of the following values: ${Object.values(APPEAL_ID).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealType;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('beforeYouStartSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.beforeYouStartSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.beforeYouStartSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'beforeYouStartSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('beforeYouStartSection.typeOfPlanningApplication', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.beforeYouStartSection.typeOfPlanningApplication = 'appeal';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `beforeYouStartSection.typeOfPlanningApplication must be one of the following values: ${Object.values(
            TYPE_OF_PLANNING_APPLICATION,
          ).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.beforeYouStartSection.typeOfPlanningApplication;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('contactDetailsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.contactDetailsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.contactDetailsSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('contactDetailsSection.name', () => {
        it('should throw an error when not given a string value', async () => {
          appeal.contactDetailsSection.name = 123;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            `contactDetailsSection.name must match the following: "/^[a-z\\-' ]+$/i"`,
          );
        });

        it('should throw an error when given a value with less than 2 characters', async () => {
          appeal.contactDetailsSection.name = 'a';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.name must be at least 2 characters',
          );
        });

        it('should throw an error when given a value with more than 80 characters', async () => {
          appeal.contactDetailsSection.name = 'a'.repeat(81);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.name must be at most 80 characters',
          );
        });

        it('should throw an error when given a value with invalid characters', async () => {
          appeal.contactDetailsSection.name = '!?<>';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            `contactDetailsSection.name must match the following: "/^[a-z\\-' ]+$/i"`,
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.contactDetailsSection.name;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('contactDetailsSection.email', () => {
        it('should throw an error when not given an email value', async () => {
          appeal.contactDetailsSection.email = 'apellant@example';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.email must be a valid email',
          );
        });

        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.contactDetailsSection.email = `${'a'.repeat(244)}@example.com`;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.email must be at most 255 characters',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.contactDetailsSection.email;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('contactDetailsSection.companyName', () => {
        it('should throw an error when given a value with more than 50 characters', async () => {
          appeal.contactDetailsSection.companyName = 'a'.repeat(51);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'contactDetailsSection.companyName must be at most 50 characters',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.contactDetailsSection.companyName;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });
    });
  });
});
