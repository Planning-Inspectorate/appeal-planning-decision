const v8 = require('v8');
const { addYears } = require('date-fns');
const appealData = require('../../../test/data/full-appeal');
const update = require('./update');
const {
  APPEAL_ID,
  APPEAL_STATE,
  APPLICATION_DECISION,
  TYPE_OF_PLANNING_APPLICATION,
} = require('../../constants');

describe('schemas/full-appeal/update', () => {
  const config = {};

  let appeal;
  let appeal2;

  beforeEach(() => {
    appeal = v8.deserialize(v8.serialize(appealData));
    appeal2 = v8.deserialize(v8.serialize(appealData));
  });

  describe('update', () => {
    it('should return the data when given valid data', async () => {
      const result = await update.validate(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should remove unknown fields', async () => {
      appeal2.unknownField = 'unknown field';

      const result = await update.validate(appeal2, config);
      expect(result).toEqual(appeal);
    });

    describe('id', () => {
      it('should strip leading/trailing spaces', async () => {
        appeal2.id = '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
        appeal.id = '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a UUID', async () => {
        appeal.id = 'abc123';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'id must be a valid UUID',
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.id = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'id must be a `string` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.id;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'id is a required field',
        );
      });
    });

    describe('horizonId', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.horizonId = 'a'.repeat(21);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'horizonId must be at most 20 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.horizonId = '  abc123  ';

        const result = await update.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          horizonId: 'abc123',
        });
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.horizonId;

        const result = await update.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('lpaCode', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.lpaCode = 'a'.repeat(21);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'lpaCode must be at most 20 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.lpaCode = '  abc123  ';

        const result = await update.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          lpaCode: 'abc123',
        });
      });

      it('should throw an error when given a null value', async () => {
        appeal.lpaCode = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'lpaCode must be a `string` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.lpaCode;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'lpaCode is a required field',
        );
      });
    });

    describe('state', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.state = 'PENDING';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          `state must be one of the following values: ${Object.values(APPEAL_STATE).join(', ')}`,
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.state = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'state must be a `string` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.state;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'state is a required field',
        );
      });
    });

    describe('appealType', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.appealType = '0001';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          `appealType must be one of the following values: ${Object.values(APPEAL_ID).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealType;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'appealType is a required field',
        );
      });
    });

    describe('decisionDate', () => {
      it('should throw an error when given a value which is in an incorrect format', async () => {
        appeal.decisionDate = '03/07/2021';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'Invalid Date or string not ISO format',
        );
      });

      it('should throw an error when given a date in the future', async () => {
        appeal.decisionDate = addYears(new Date(), 1);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'decisionDate must be in the past',
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.decisionDate = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'decisionDate must be a `date` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.decisionDate;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'The given date must be a valid Date instance',
        );
      });
    });

    describe('eligibility', () => {
      it('should remove unknown fields', async () => {
        appeal2.eligibility.unknownField = 'unknown field';

        const result = await update.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('eligibility.applicationCategories', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.eligibility.applicationCategories = 'appeal';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility.applicationCategories must match the following: "none_of_these"',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.applicationCategories;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility.applicationCategories is a required field',
        );
      });
    });

    describe('eligibility.applicationDecision', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.eligibility.applicationDecision = 'appeal';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          `eligibility.applicationDecision must be one of the following values: ${Object.values(
            APPLICATION_DECISION,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.applicationDecision;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility.applicationDecision is a required field',
        );
      });
    });

    describe('eligibility.enforcementNotice', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          enforcementNotice: 'yes',
        };

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility.enforcementNotice = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.enforcementNotice;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'eligibility.enforcementNotice is a required field',
        );
      });
    });

    describe('beforeYouStartSection.typeOfPlanningApplication', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.beforeYouStartSection.typeOfPlanningApplication = 'appeal';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          `beforeYouStartSection.typeOfPlanningApplication must be one of the following values: ${Object.values(
            TYPE_OF_PLANNING_APPLICATION,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.beforeYouStartSection.typeOfPlanningApplication;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'beforeYouStartSection.typeOfPlanningApplication is a required field',
        );
      });
    });

    describe('yourAppealSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.yourAppealSection.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement', () => {
      it('should remove unknown fields', async () => {
        appeal2.yourAppealSection.appealStatement.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile', () => {
      it('should remove unknown fields', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile.name', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.name = 'a'.repeat(256);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.name must be at most 255 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.name = '  test-pdf.pdf  ';
        appeal.yourAppealSection.appealStatement.uploadedFile.name = 'test-pdf.pdf';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.yourAppealSection.appealStatement.uploadedFile.name;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.name is a required field',
        );
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile.originalFileName', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName = 'a'.repeat(256);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.originalFileName must be at most 255 characters',
        );
      });

      it('should strip leading/trailing spaces', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.originalFileName =
          '  test-pdf.pdf  ';
        appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName = 'test-pdf.pdf';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.originalFileName is a required field',
        );
      });
    });

    describe('yourAppealSection.appealStatement.uploadedFile.id', () => {
      it('should strip leading/trailing spaces', async () => {
        appeal2.yourAppealSection.appealStatement.uploadedFile.id =
          '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
        appeal.yourAppealSection.appealStatement.uploadedFile.id =
          '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a UUID', async () => {
        appeal.yourAppealSection.appealStatement.uploadedFile.id = 'abc123';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.id must be a valid UUID',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.yourAppealSection.appealStatement.uploadedFile.id;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.uploadedFile.id is a required field',
        );
      });
    });

    describe('yourAppealSection.appealStatement.hasSensitiveInformation', () => {
      it('should throw an error when not given a boolean', async () => {
        appeal.yourAppealSection.appealStatement.hasSensitiveInformation = 'false ';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.hasSensitiveInformation must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.yourAppealSection.appealStatement.hasSensitiveInformation;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement.hasSensitiveInformation is a required field',
        );
      });
    });

    describe('contactDetailsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.contactDetailsSection.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.contactDetailsSection = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('contactDetailsSection.name', () => {
      it('should throw an error when not given a string value', async () => {
        appeal.contactDetailsSection.name = 123;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          `contactDetailsSection.name must match the following: "/^[a-z\\-' ]+$/i"`,
        );
      });

      it('should throw an error when given a value with less than 2 characters', async () => {
        appeal.contactDetailsSection.name = 'a';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.name must be at least 2 characters',
        );
      });

      it('should throw an error when given a value with more than 80 characters', async () => {
        appeal.contactDetailsSection.name = 'a'.repeat(81);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.name must be at most 80 characters',
        );
      });

      it('should throw an error when given a value with invalid characters', async () => {
        appeal.contactDetailsSection.name = '!?<>';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          `contactDetailsSection.name must match the following: "/^[a-z\\-' ]+$/i"`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.contactDetailsSection.name;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.name is a required field',
        );
      });
    });

    describe('contactDetailsSection.email', () => {
      it('should throw an error when not given an email value', async () => {
        appeal.contactDetailsSection.email = 'apellant@example';

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.email must be a valid email',
        );
      });

      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.contactDetailsSection.email = `${'a'.repeat(244)}@example.com`;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.email must be at most 255 characters',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.contactDetailsSection.email;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.email is a required field',
        );
      });
    });

    describe('contactDetailsSection.companyName', () => {
      it('should throw an error when given a value with more than 50 characters', async () => {
        appeal.contactDetailsSection.companyName = 'a'.repeat(51);

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'contactDetailsSection.companyName must be at most 50 characters',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.contactDetailsSection.companyName;

        const result = await update.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('appealSiteSection.siteAddress', () => {
        describe('appealSiteSection.siteAddress', () => {
          it('should remove unknown fields', async () => {
            appeal2.appealSiteSection.siteAddress.unknownField = 'unknown field';

            const result = await update.validate(appeal2, config);
            expect(result).toEqual(appeal);
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteAddress = null;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress must be a `object` type, but the final value was: `null`',
            );
          });

          it('should throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.postcode is a required field',
            );
          });
        });

        describe('appealSiteSection.siteAddress.addressLine1', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.addressLine1 = 'a'.repeat(61);

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine1 must be at most 60 characters',
            );
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteAddress.addressLine1 = null;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine1 must be a `string` type, but the final value was: `null`',
            );
          });

          it('should throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.addressLine1;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine1 is a required field',
            );
          });
        });

        describe('appealSiteSection.siteAddress.addressLine2', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.addressLine2 = 'a'.repeat(61);

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.addressLine2 must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.addressLine2;

            const result = await update.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.town', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.town = 'a'.repeat(61);

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.town must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.town;

            const result = await update.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.county', () => {
          it('should throw an error when given a value with more than 60 characters', async () => {
            appeal.appealSiteSection.siteAddress.county = 'a'.repeat(61);

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.county must be at most 60 characters',
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.county;

            const result = await update.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('appealSiteSection.siteAddress.postcode', () => {
          it('should throw an error when given a value with more than 8 characters', async () => {
            appeal.appealSiteSection.siteAddress.postcode = 'a'.repeat(9);

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.postcode must be at most 8 characters',
            );
          });

          it('should throw an error when given a null value', async () => {
            appeal.appealSiteSection.siteAddress.postcode = null;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.postcode must be a `string` type, but the final value was: `null`',
            );
          });

          it('should throw an error when not given a value', async () => {
            delete appeal.appealSiteSection.siteAddress.postcode;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'appealSiteSection.siteAddress.postcode is a required field',
            );
          });
        });
      });

      describe('appealSiteSection.ownsSomeOfTheLand', () => {
        it('should throw an error when not given a boolean', async () => {
          appeal.appealSiteSection.ownsSomeOfTheLand = 'false ';

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.ownsSomeOfTheLand must be a `boolean` type, but the final value was: `"false "` (cast from the value `false`).',
          );
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.appealSiteSection.ownsSomeOfTheLand;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'appealSiteSection.ownsSomeOfTheLand is a required field',
          );
        });
      });
    });

    describe('aboutYouSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.aboutYouSection.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('aboutYouSection.yourDetails', () => {
        it('should throw an error when given a null value', async () => {
          appeal.aboutYouSection.yourDetails = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'aboutYouSection.yourDetails must be a `object` type, but the final value was: `null`',
          );
        });

        describe('aboutYouSection.yourDetails.appealingOnBehalfOf', () => {
          it('should throw an error when not given a string value', async () => {
            appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 123;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              `aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-' ]*$/i"`,
            );
          });

          it('should throw an error when given a value with more than 80 characters', async () => {
            appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 'a'.repeat(81);

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'aboutYouSection.yourDetails.appealingOnBehalfOf must be at most 80 characters',
            );
          });

          it('should throw an error when given a value with invalid characters', async () => {
            appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = '!?<>';

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              `aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-' ]*$/i"`,
            );
          });

          it('should not throw an error when not given a value', async () => {
            delete appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;

            const result = await update.validate(appeal, config);
            expect(result).toEqual(appeal);
          });
        });

        describe('aboutYouSection.yourDetails.companyName', () => {
          it('should not throw an error when not given a value', async () => {
            delete appeal.aboutYouSection.yourDetails.companyName;

            const result = await update.validate(appeal, config);
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

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'aboutYouSection.yourDetails.isOriginalApplicant must be a `boolean` type, but the final value was: `"yes"`',
            );
          });

          it('should throw an error when given a null value', async () => {
            appeal.aboutYouSection.yourDetails.isOriginalApplicant = null;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'aboutYouSection.yourDetails.isOriginalApplicant must be a `boolean` type, but the final value was: `null`',
            );
          });

          it('should throw an error when not given a value', async () => {
            delete appeal.aboutYouSection.yourDetails.isOriginalApplicant;

            await expect(() => update.validate(appeal, config)).rejects.toThrow(
              'aboutYouSection.yourDetails.isOriginalApplicant is a required field',
            );
          });
        });
      });
    });

    describe('planningApplicationDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.planningApplicationDocumentsSection.unknownField = 'unknown field';

        const result = await update.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.planningApplicationDocumentsSection = null;

        await expect(() => update.validate(appeal, config)).rejects.toThrow(
          'planningApplicationDocumentsSection must be a `object` type, but the final value was: `null`',
        );
      });

      describe('planningApplicationDocumentsSection.applicationNumber', () => {
        it('should throw an error when given a value with more than 30 characters', async () => {
          appeal.planningApplicationDocumentsSection.applicationNumber = 'a'.repeat(31);

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.applicationNumber must be at most 30 characters',
          );
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.applicationNumber = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.applicationNumber must be a `string` type, but the final value was: `null`',
          );
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.applicationNumber;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.applicationNumber is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.isDesignAccessStatementSubmitted', () => {
        it('should throw an error when not given a boolean value', async () => {
          appeal.planningApplicationDocumentsSection = {
            isDesignAccessStatementSubmitted: 'yes',
          };

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.isDesignAccessStatementSubmitted must be a `boolean` type, but the final value was: `"yes"`',
          );
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.isDesignAccessStatementSubmitted = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.isDesignAccessStatementSubmitted must be a `boolean` type, but the final value was: `null`',
          );
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.isDesignAccessStatementSubmitted;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.isDesignAccessStatementSubmitted is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.unknownField =
            'unknown field';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.unknownField =
            'unknown field';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.name', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
            'a'.repeat(256);

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.name must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name =
            'test-pdf.pdf';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.name;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.name is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            'a'.repeat(256);

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName =
            'test-pdf.pdf';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile
            .originalFileName;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.originalFileName is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.originalApplication.uploadedFile.id', () => {
        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
            '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id =
            '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a UUID', async () => {
          appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id = 'abc123';

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.id must be a valid UUID',
          );
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.originalApplication.uploadedFile.id;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.originalApplication.uploadedFile.id is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.unknownField =
            'unknown field';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.unknownField =
            'unknown field';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
            'a'.repeat(256);

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name =
            'test-pdf.pdf';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.name is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            'a'.repeat(256);

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName =
            'test-pdf.pdf';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile
            .originalFileName;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.originalFileName is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id', () => {
        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
            '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
            '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a UUID', async () => {
          appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id =
            'abc123';

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id must be a valid UUID',
          );
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.designAccessStatement.uploadedFile.id is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.unknownField = 'unknown field';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile', () => {
        it('should remove unknown fields', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.unknownField =
            'unknown field';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when given a null value', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile = null;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile must be a `object` type, but the final value was: `null`',
          );
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.name', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name = 'a'.repeat(
            256,
          );

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.name must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name =
            'test-pdf.pdf';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.name;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.name is a required field',
          );
        });
      });

      describe('planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName', () => {
        it('should throw an error when given a value with more than 255 characters', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            'a'.repeat(256);

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName must be at most 255 characters',
          );
        });

        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            '  test-pdf.pdf  ';
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName =
            'test-pdf.pdf';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile
            .originalFileName;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.originalFileName is a required field',
          );
        });
      });

      describe('c.decisionLetter.uploadedFile.id', () => {
        it('should strip leading/trailing spaces', async () => {
          appeal2.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
            '  271c9b5b-af90-4b45-b0e7-0a7882da1e03  ';
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id =
            '271c9b5b-af90-4b45-b0e7-0a7882da1e03';

          const result = await update.validate(appeal2, config);
          expect(result).toEqual(appeal);
        });

        it('should throw an error when not given a UUID', async () => {
          appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id = 'abc123';

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.id must be a valid UUID',
          );
        });

        it('should throw an error when not given a value', async () => {
          delete appeal.planningApplicationDocumentsSection.decisionLetter.uploadedFile.id;

          await expect(() => update.validate(appeal, config)).rejects.toThrow(
            'planningApplicationDocumentsSection.decisionLetter.uploadedFile.id is a required field',
          );
        });
      });
    });
  });
});
