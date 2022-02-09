const v8 = require('v8');
const { subMonths } = require('date-fns');
const appealData = require('../../../test/data/full-appeal');
const insert = require('./insert');
const {
  APPEAL_STATE,
  APPEAL_ID,
  APPLICATION_DECISION,
  APPLICATION_CATEGORIES,
  KNOW_THE_OWNERS,
  TYPE_OF_PLANNING_APPLICATION,
  I_AGREE,
} = require('../../constants');

describe('schemas/full-appeal/insert', () => {
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
      it('should strip leading/trailing spaces', async () => {
        appeal2.id = '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
        appeal.id = '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

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

    describe('decisionDate', () => {
      it('should throw an error when given a value which is in an incorrect format', async () => {
        appeal.decisionDate = '03/07/2021';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Invalid Date or string not ISO format',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.decisionDate;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when appeal type and application decision is not passed', async () => {
        appeal.decisionDate = subMonths(new Date(), 1);
        delete appeal.appealType;
        delete appeal.eligibility.applicationDecision;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('typeOfPlanningApplication', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.typeOfPlanningApplication = 'appeal';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `typeOfPlanningApplication must be one of the following values: ${Object.values(
            TYPE_OF_PLANNING_APPLICATION,
          ).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.typeOfPlanningApplication;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when given a null value', async () => {
        appeal.typeOfPlanningApplication = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('eligibility', () => {
      it('should remove unknown fields', async () => {
        appeal2.eligibility.unknownField = 'unknown field';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('eligibility.applicationCategories', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.eligibility.applicationCategories = 'appeal';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `eligibility.applicationCategories must be one of the following values: ${Object.values(
            APPLICATION_CATEGORIES,
          ).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.eligibility.applicationCategories;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when given a null value', async () => {
        appeal.eligibility.applicationCategories = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when multiple values are given', async () => {
        appeal.eligibility.applicationCategories = ['a_listed_building', 'major_dwellings'];

        const result = await insert.validate(appeal, config);
        appeal.eligibility.applicationCategories = null;
        expect(result).toEqual(appeal);
      });
    });

    describe('eligibility.applicationDecision', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.eligibility.applicationDecision = 'appeal';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `eligibility.applicationDecision must be one of the following values: ${Object.values(
            APPLICATION_DECISION,
          ).join(', ')}`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.eligibility.applicationDecision;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when given a null value', async () => {
        appeal.eligibility.applicationDecision = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('eligibility.enforcementNotice', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          enforcementNotice: 'yes',
        };

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.eligibility.enforcementNotice;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('yourAppealSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.yourAppealSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement', () => {
      it('should remove unknown fields', async () => {
        appeal2.yourAppealSection.appealStatement.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile', () => {
      it('should remove unknown fields', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile.name', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.name = 'a'.repeat(256);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.name must be at most 255 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.name = '  test-pdf.pdf  ';
        appeal.yourAppealSection.appealStatement.uploadedFile.name = 'test-pdf.pdf';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal2.yourAppealSection.appealStatement.uploadedFile.name;
        appeal.yourAppealSection.appealStatement.uploadedFile.name = '';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile.originalFileName', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName = 'a'.repeat(256);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.originalFileName must be at most 255 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.originalFileName =
          '  test-pdf.pdf  ';
        appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName = 'test-pdf.pdf';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal2.yourAppealSection.appealStatement.uploadedFile.originalFileName;
        appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName = '';

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile.id', () => {
      it('should strip leading/trailing spaces', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.id =
          '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
        appeal.yourAppealSection.appealStatement.uploadedFile.id =
          '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a UUID', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.id = 'abc123';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.id must be a valid UUID',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.id = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal2.yourAppealSection.appealStatement.uploadedFile.id;
        appeal.yourAppealSection.appealStatement.uploadedFile.id = null;

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('yourAppealSection.appealStatement.hasSensitiveInformation', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.yourAppealSection.appealStatement.hasSensitiveInformation = 'false ';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.hasSensitiveInformation must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement.hasSensitiveInformation = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal2.yourAppealSection.appealStatement.hasSensitiveInformation;
        appeal.yourAppealSection.appealStatement.hasSensitiveInformation = null;

        const result = await insert.validate(appeal2, config);
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

    describe('appealSiteSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('appealSiteSection.siteAddress', () => {
        describe('appealSiteSection.siteAddress', () => {
          it('should remove unknown fields', async () => {
            appeal2.appealSiteSection.siteAddress.unknownField = 'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteAddress = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress must be a `object` type, but the final value was: `null`',
            );
          });
        });

        describe('appealSiteSection.siteAddress.addressLine1', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.addressLine1 = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine1 must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.addressLine1;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.addressLine2', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.addressLine2 = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine2 must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.addressLine2;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.town', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.town = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.town must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.town;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.county', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.county = 'a'.repeat(61);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.county must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.county;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.postcode', () => {
          it('should throw an error when given a value with more than 8 characters', async () => {
            appeal.appealSiteSection.siteAddress.postcode = 'a'.repeat(9);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.postcode must be at most 8 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.postcode;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });

      describe('appealSiteSection.ownsSomeOfTheLand', () => {
        it('should throw an error when not given a boolean', async () => {
          appeal.appealSiteSection.ownsSomeOfTheLand = 'false ';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.ownsSomeOfTheLand must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
          );
        });

        it('should not throw an error when given a null value', async () => {
          appeal.appealSiteSection.ownsSomeOfTheLand = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.appealSiteSection.ownsSomeOfTheLand;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('appealSiteSection.ownsAllTheLand', () => {
        it('should throw an error when not given a boolean', async () => {
          appeal.appealSiteSection.ownsAllTheLand = 'true ';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.ownsAllTheLand must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
          );
        });

        it('should not throw an error when given a null value', async () => {
          appeal.appealSiteSection.ownsAllTheLand = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.appealSiteSection.ownsAllTheLand;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('appealSiteSection.knowsTheOwners', () => {
        it('should throw an error when given an invalid value', async () => {
          appeal.appealSiteSection.knowsTheOwners = 'perhaps';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            `appealSiteSection.knowsTheOwners must be one of the following values: ${Object.values(
              KNOW_THE_OWNERS,
            ).join(', ')}`,
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.appealSiteSection.knowsTheOwners;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when given a null value', async () => {
          appeal.appealSiteSection.knowsTheOwners = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('appealSiteSection.identifyingTheOwners', () => {
        it('should throw an error when given an invalid value', async () => {
          appeal.appealSiteSection.identifyingTheOwners = 'not valid';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            `appealSiteSection.identifyingTheOwners must be one of the following values: ${I_AGREE}`,
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.appealSiteSection.identifyingTheOwners;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when given a null value', async () => {
          appeal.appealSiteSection.identifyingTheOwners = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });
    });

    describe('appealSiteSection.isAgriculturalHolding', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.appealSiteSection.isAgriculturalHolding = 'true ';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.isAgriculturalHolding must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.isAgriculturalHolding = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.isAgriculturalHolding;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.isAgriculturalHoldingTenant', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.appealSiteSection.isAgriculturalHoldingTenant = 'true ';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.isAgriculturalHoldingTenant must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.isAgriculturalHoldingTenant = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.isAgriculturalHoldingTenant;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.areOtherTenants', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.appealSiteSection.areOtherTenants = 'true ';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.areOtherTenants must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.areOtherTenants = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.areOtherTenants;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.isVisibleFromRoad', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.appealSiteSection.isVisibleFromRoad = 'false ';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.isVisibleFromRoad must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.isVisibleFromRoad = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.isVisibleFromRoad;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.visibleFromRoadDetails', () => {
      it('should throw an error when not given a value and appealSiteSection.isVisibleFromRoad is false', async () => {
        appeal.appealSiteSection.isVisibleFromRoad = false;
        appeal.appealSiteSection.visibleFromRoadDetails = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Tell us how visibility is restricted',
        );
      });

      it('should throw an error when given a value longer than 255 chars and appealSiteSection.isVisibleFromRoad is false', async () => {
        appeal.appealSiteSection.isVisibleFromRoad = false;
        appeal.appealSiteSection.visibleFromRoadDetails = 'a'.repeat(256);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'How visibility is restricted must be 255 characters or less',
        );
      });

      it('should not throw an error when given a null value and appealSiteSection.isVisibleFromRoad is true', async () => {
        appeal.appealSiteSection.isVisibleFromRoad = true;
        appeal.appealSiteSection.visibleFromRoadDetails = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.hasHealthSafetyIssues', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.appealSiteSection.hasHealthSafetyIssues = 'true ';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.hasHealthSafetyIssues must be a `boolean` type, but the final value was: `"true "` (cast from the value `true`).',
        );
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.hasHealthSafetyIssues = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.hasHealthSafetyIssues;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.healthSafetyIssuesDetails', () => {
      it('should throw an error when not given a value and appealSiteSection.hasHealthSafetyIssues is true', async () => {
        appeal.appealSiteSection.hasHealthSafetyIssues = true;
        appeal.appealSiteSection.healthSafetyIssuesDetails = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Tell us about the health and safety issues',
        );
      });

      it('should throw an error when given a value longer than 255 chars and appealSiteSection.hasHealthSafetyIssues is true', async () => {
        appeal.appealSiteSection.hasHealthSafetyIssues = true;
        appeal.appealSiteSection.healthSafetyIssuesDetails = 'a'.repeat(256);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Health and safety information must be 255 characters or less',
        );
      });

      it('should not throw an error when given a null value and appealSiteSection.hasHealthSafetyIssues is false', async () => {
        appeal.appealSiteSection.hasHealthSafetyIssues = false;
        appeal.appealSiteSection.healthSafetyIssuesDetails = null;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('aboutYouSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.aboutYouSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('aboutYouSection.yourDetails', () => {
        it('should throw an error when given a null value', async () => {
          appeal.aboutYouSection.yourDetails = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'aboutYouSection.yourDetails must be a `object` type, but the final value was: `null`',
          );
        });

        describe('aboutYouSection.yourDetails.appealingOnBehalfOf', () => {
          it('should throw an error when not given a string value', async () => {
            appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 123;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-' ]*$/i"`,
            );
          });

          it('should throw an error when given a value with more than 80 characters', async () => {
            appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 'a'.repeat(81);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'aboutYouSection.yourDetails.appealingOnBehalfOf must be at most 80 characters',
            );
          });

          it('should throw an error when given a value with invalid characters', async () => {
            appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = '!?<>';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              `aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-' ]*$/i"`,
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('aboutYouSection.yourDetails.companyName', () => {
          it('should not throw an error when not given a value', async () => {
            delete appeal.aboutYouSection.yourDetails.companyName;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('aboutYouSection.yourDetails.isOriginalApplicant', () => {
          it('should throw an error when not given a boolean value', async () => {
            appeal.aboutYouSection = {
              yourDetails: {
                isOriginalApplicant: 'yes',
              },
            };

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'aboutYouSection.yourDetails.isOriginalApplicant must be a `boolean` type, but the final value was: `"yes"`',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.aboutYouSection.yourDetails.isOriginalApplicant;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });
      });
    });

    describe('planningApplicationDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.planningApplicationDocumentsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.planningApplicationDocumentsSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('planningApplicationDocumentsSection.applicationNumber', () => {
        it('should throw an error when given a value with more than 30 characters', async () => {
          appeal.planningApplicationDocumentsSection.applicationNumber = 'a'.repeat(31);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.applicationNumber must be at most 30 characters',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.applicationNumber;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.isDesignAccessStatementSubmitted', () => {
        it('should throw an error when not given a boolean value', async () => {
          appeal.planningApplicationDocumentsSection = {
            isDesignAccessStatementSubmitted: 'yes',
          };

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.isDesignAccessStatementSubmitted must be a `boolean` type, but the final value was: `"yes"`',
          );
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.isDesignAccessStatementSubmitted;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.name', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
            'a'.repeat(256);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.name must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
            'test-pdf.pdf';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.name;
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name = '';

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            'a'.repeat(256);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            'test-pdf.pdf';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile
            .originalFileName;
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            '';

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.id', () => {
        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
            '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
            '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a UUID', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id = 'abc123';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.id must be a valid UUID',
          );
        });

        it('should not throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.id;
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id = null;

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
            'a'.repeat(256);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
            'test-pdf.pdf';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
            .name;
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name = '';

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            'a'.repeat(256);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            'test-pdf.pdf';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
            .originalFileName;
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            '';

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id', () => {
        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
            '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
            '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a UUID', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
            'abc123';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id must be a valid UUID',
          );
        });

        it('should not throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id;
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id = null;

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.unknownField = 'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.unknownField =
            'unknown field';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile = null;

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.name', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name = 'a'.repeat(
            256,
          );

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.name must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
            'test-pdf.pdf';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name;
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name = '';

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            'a'.repeat(256);

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            'test-pdf.pdf';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile
            .originalFileName;
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            '';

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.id', () => {
        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
            '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
            '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a UUID', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = 'abc123';

          await expect(() => insert.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.id must be a valid UUID',
          );
        });

        it('should not throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = null;

          const result = await insert.validate(appeal, config);
          expect(result).toEqual(appeal);
        });

        it('should not throw an error when not given a value', async () => {
          delete appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id;
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = null;

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });
      });
    });

    describe('appealSubmission', () => {
      it('should throw an error when given a null value', async () => {
        appeal.appealSubmission = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSubmission must be a `object` type, but the final value was: `null`',
        );
      });

      describe('appealSubmission.appealPDFStatement', () => {
        it('should not throw an error when not given a value', async () => {
          delete appeal2.appealSubmission.appealPDFStatement;

          appeal.appealSubmission.appealPDFStatement.uploadedFile = {
            id: null,
            name: '',
            originalFileName: '',
            fileName: '',
            location: '',
            size: undefined,
          };

          const result = await insert.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile', () => {
          it('should remove unknown fields', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.unknownField = 'unknown field';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile = null;

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile must be a `object` type, but the final value was: `null`',
            );
          });
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile.name', () => {
          it('should throw an error when given a value with more than 255 characters', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile.name = 'a'.repeat(256);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile.name must be at most 255 characters',
            );
          });

          it('should strip leading/trailing spaces', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.name = '  test-pdf.pdf  ';
            appeal.appealSubmission.appealPDFStatement.uploadedFile.name = 'test-pdf.pdf';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.name;
            appeal.appealSubmission.appealPDFStatement.uploadedFile.name = '';

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile.originalFileName', () => {
          it('should throw an error when given a value with more than 255 characters', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName = 'a'.repeat(
              256,
            );

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile.originalFileName must be at most 255 characters',
            );
          });

          it('should strip leading/trailing spaces', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
              '  test-pdf.pdf  ';
            appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
              'test-pdf.pdf';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.originalFileName;
            appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName = '';

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile.fileName', () => {
          it('should throw an error when given a value with more than 255 characters', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile.fileName = 'a'.repeat(256);

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile.fileName must be at most 255 characters',
            );
          });

          it('should strip leading/trailing spaces', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.fileName = '  test-pdf.pdf  ';
            appeal.appealSubmission.appealPDFStatement.uploadedFile.fileName = 'test-pdf.pdf';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.fileName;
            appeal.appealSubmission.appealPDFStatement.uploadedFile.fileName = '';

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile.location', () => {
          it('should strip leading/trailing spaces', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.location = '  location  ';
            appeal.appealSubmission.appealPDFStatement.uploadedFile.location = 'location';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.location;
            appeal.appealSubmission.appealPDFStatement.uploadedFile.location = '';

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile.size', () => {
          it('should throw error if size is not numeric', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile.size = 'size';
            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile.size must be a `number` type, but the final value was: `NaN` (cast from the value `74375`).',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.size;
            appeal.appealSubmission.appealPDFStatement.uploadedFile.size = undefined;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSubmission.appealPDFStatement.uploadedFile.id', () => {
          it('should strip leading/trailing spaces', async () => {
            appeal2.appealSubmission.appealPDFStatement.uploadedFile.id =
              '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
            appeal.appealSubmission.appealPDFStatement.uploadedFile.id =
              '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when not given a UUID', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile.id = 'abc123';

            await expect(() => insert.validate(appeal, config)).rejects.toThrow(
              'appealSubmission.appealPDFStatement.uploadedFile.id must be a valid UUID',
            );
          });

          it('should not throw an error when given a null value', async () => {
            appeal.appealSubmission.appealPDFStatement.uploadedFile.id = null;

            const result = await insert.validate(appeal, config);
            expect(result).toEqual(appeal);
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal2.appealSubmission.appealPDFStatement.uploadedFile.id;
            appeal.appealSubmission.appealPDFStatement.uploadedFile.id = null;

            const result = await insert.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });
        });
      });
    });
  });
});
