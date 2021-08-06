const { subYears, addYears } = require('date-fns');
const v8 = require('v8');
const appealData = require('../../test/data/appeal');
const householderAppeal = require('./householder-appeal');
const { APPEAL_STATE, SECTION_STATE } = require('../constants');

describe('schemas/householder-appeal', () => {
  const config = {};

  let appeal;
  let appeal2;

  beforeEach(() => {
    appeal = v8.deserialize(v8.serialize(appealData));
    appeal2 = v8.deserialize(v8.serialize(appealData));
  });

  describe('updateAppeal', () => {
    it('should return the data when given valid data', async () => {
      const result = await householderAppeal.validate(appeal, config);
      expect(result).toEqual(appeal);
    });

    it('should remove unknown fields', async () => {
      appeal2.unknownField = 'unknown field';

      const result = await householderAppeal.validate(appeal2, config);
      expect(result).toEqual(appeal);
    });

    describe('id', () => {
      it('should throw an error when not given a UUID', async () => {
        appeal.id = 'abc123';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('id must be a valid UUID');
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.id = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'id must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.id;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('id is a required field');
        }
      });
    });

    describe('horizonId', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.horizonId = 'a'.repeat(21);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('horizonId must be at most 20 characters');
        }
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.horizonId = '  abc123  ';

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          horizonId: 'abc123',
        });
      });

      it('should not throw an error when given a null value', async () => {
        appeal.horizonId = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.horizonId;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('lpaCode', () => {
      it('should throw an error when given a value with more than 20 characters', async () => {
        appeal.lpaCode = 'a'.repeat(21);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('lpaCode must be at most 20 characters');
        }
      });

      it('should strip leading/trailing spaces', async () => {
        appeal.lpaCode = '  abc123  ';

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual({
          ...appeal,
          lpaCode: 'abc123',
        });
      });

      it('should throw an error when given a null value', async () => {
        appeal.lpaCode = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'lpaCode must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.lpaCode;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('lpaCode is a required field');
        }
      });
    });

    describe('decisionDate', () => {
      it('should throw an error when given a value which is in an incorrect format', async () => {
        appeal.decisionDate = '03/07/2021';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('Invalid Date or string not ISO format');
        }
      });

      it('should throw an error when given a date in the future', async () => {
        appeal.decisionDate = addYears(new Date(), 1);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('decisionDate must be in the past');
        }
      });

      it('should throw an error when given a date after the deadline date', async () => {
        appeal.decisionDate = subYears(new Date(), 1);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('decisionDate must be before the deadline date');
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.decisionDate = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'decisionDate must be a `date` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.decisionDate;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('The given date must be a valid Date instance');
        }
      });
    });

    describe('submissionDate', () => {
      it('should not throw an error when given a null value', async () => {
        appeal.submissionDate = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.submissionDate;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('state', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.state = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `state must be one of the following values: ${Object.values(APPEAL_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.state = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'state must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.state;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('state is a required field');
        }
      });
    });

    describe('eligibility', () => {
      it('should remove unknown fields', async () => {
        appeal2.eligibility.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('eligibility.isListedBuilding is a required field');
        }
      });
    });

    describe('eligibility.enforcementNotice', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          enforcementNotice: 'yes',
        };

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility.enforcementNotice = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.enforcementNotice must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.enforcementNotice;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('eligibility.enforcementNotice is a required field');
        }
      });
    });

    describe('eligibility.householderPlanningPermission', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          householderPlanningPermission: 'yes',
        };

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.householderPlanningPermission must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility.householderPlanningPermission = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.householderPlanningPermission must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.householderPlanningPermission;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'eligibility.householderPlanningPermission is a required field',
          );
        }
      });
    });

    describe('eligibility.isClaimingCosts', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          isClaimingCosts: 'yes',
        };

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.isClaimingCosts must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility.isClaimingCosts = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.isClaimingCosts must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.isClaimingCosts;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('eligibility.isClaimingCosts is a required field');
        }
      });
    });

    describe('eligibility.isListedBuilding', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          isListedBuilding: 'yes',
        };

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.isListedBuilding must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility.isListedBuilding = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'eligibility.isListedBuilding must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.eligibility.isListedBuilding;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('eligibility.isListedBuilding is a required field');
        }
      });
    });

    describe('aboutYouSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.aboutYouSection.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.aboutYouSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('aboutYouSection.yourDetails.email is a required field');
        }
      });
    });

    describe('aboutYouSection.yourDetails', () => {
      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection.yourDetails = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('aboutYouSection.yourDetails.email is a required field');
        }
      });
    });

    describe('aboutYouSection.yourDetails.isOriginalApplicant', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.aboutYouSection = {
          yourDetails: {
            isOriginalApplicant: 'yes',
          },
        };

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.isOriginalApplicant must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection.yourDetails.isOriginalApplicant = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.isOriginalApplicant must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails.isOriginalApplicant;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'aboutYouSection.yourDetails.isOriginalApplicant is a required field',
          );
        }
      });
    });

    describe('aboutYouSection.yourDetails.name', () => {
      it('should throw an error when not given a string value', async () => {
        appeal.aboutYouSection.yourDetails.name = 123;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            `aboutYouSection.yourDetails.name must match the following: "/^[a-z\\-' ]+$/i"`,
          );
        }
      });

      it('should throw an error when given a value with less than 2 characters', async () => {
        appeal.aboutYouSection.yourDetails.name = 'a';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.name must be at least 2 characters',
          );
        }
      });

      it('should throw an error when given a value with more than 80 characters', async () => {
        appeal.aboutYouSection.yourDetails.name = 'a'.repeat(81);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.name must be at most 80 characters',
          );
        }
      });

      it('should throw an error when given a value with invalid characters', async () => {
        appeal.aboutYouSection.yourDetails.name = '!?<>';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            `aboutYouSection.yourDetails.name must match the following: "/^[a-z\\-' ]+$/i"`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection.yourDetails.name = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.name must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails.name;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('aboutYouSection.yourDetails.name is a required field');
        }
      });
    });

    describe('aboutYouSection.yourDetails.email', () => {
      it('should throw an error when not given an email value', async () => {
        appeal.aboutYouSection.yourDetails.email = 'apellant@example';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain('aboutYouSection.yourDetails.email must be a valid email');
        }
      });

      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.aboutYouSection.yourDetails.email = `${'a'.repeat(244)}@example.com`;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.email must be at most 255 characters',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection.yourDetails.email = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.email must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails.email;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('aboutYouSection.yourDetails.email is a required field');
        }
      });
    });

    describe('aboutYouSection.yourDetails.appealingOnBehalfOf', () => {
      it('should throw an error when not given a string value', async () => {
        appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 123;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            `aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-' ]*$/i"`,
          );
        }
      });

      it('should throw an error when given a value with more than 80 characters', async () => {
        appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = 'a'.repeat(81);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'aboutYouSection.yourDetails.appealingOnBehalfOf must be at most 80 characters',
          );
        }
      });

      it('should throw an error when given a value with invalid characters', async () => {
        appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = '!?<>';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            `aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-' ]*$/i"`,
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('requiredDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.requiredDocumentsSection.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.requiredDocumentsSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'requiredDocumentsSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.requiredDocumentsSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'requiredDocumentsSection.applicationNumber is a required field'
          );
        }
      });
    });

    describe('requiredDocumentsSection.applicationNumber', () => {
      it('should throw an error when given a value with more than 30 characters', async () => {
        appeal.requiredDocumentsSection.applicationNumber = 'a'.repeat(31);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'requiredDocumentsSection.applicationNumber must be at most 30 characters',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.requiredDocumentsSection.applicationNumber = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'requiredDocumentsSection.applicationNumber must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.requiredDocumentsSection.applicationNumber;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'requiredDocumentsSection.applicationNumber is a required field'
          );
        }
      });
    });

    describe('requiredDocumentsSection.originalApplication', () => {
      it('should throw an error when given a null value', async () => {
        appeal.requiredDocumentsSection.originalApplication = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'requiredDocumentsSection.originalApplication must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.requiredDocumentsSection.originalApplication;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'requiredDocumentsSection.originalApplication.uploadedFile.id is a required field',
          );
        }
      });
    });

    describe('requiredDocumentsSection.decisionLetter', () => {
      it('should throw an error when given a null value', async () => {
        appeal.requiredDocumentsSection.decisionLetter = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'requiredDocumentsSection.decisionLetter must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.requiredDocumentsSection.decisionLetter;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'requiredDocumentsSection.decisionLetter.uploadedFile.id is a required field',
          );
        }
      });
    });

    describe('yourAppealSection', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'yourAppealSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.yourAppealSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'yourAppealSection.appealStatement.hasSensitiveInformation is a required field',
          );
        }
      });
    });

    describe('yourAppealSection.appealStatement', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'yourAppealSection.appealStatement must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.yourAppealSection.appealStatement;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'yourAppealSection.appealStatement.hasSensitiveInformation is a required field',
          );
        }
      });
    });

    describe('yourAppealSection.appealStatement.hasSensitiveInformation', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement.hasSensitiveInformation = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'yourAppealSection.appealStatement.hasSensitiveInformation must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when a value is not given', async () => {
        appeal.yourAppealSection = {
          appealStatement: {},
        };

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'yourAppealSection.appealStatement.hasSensitiveInformation is a required field',
          );
        }
      });
    });

    describe('yourAppealSection.otherDocuments', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.otherDocuments = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'yourAppealSection.otherDocuments must be a `object` type, but the final value was: `null`',
          );
        }
      });

      // it('should throw an error when not given a value', async () => {
      //   delete appeal.yourAppealSection.otherDocuments;

      //   try {
      //     await householderAppeal.validate(appeal, config);
      //     throw new Error('Expected error not thrown');
      //   } catch (err) {
      //     expect(err.message).toEqual(
      //       'yourAppealSection.otherDocuments.uploadedFiles[0].id is a required field',
      //     );
      //   }
      // });
    });

    describe('appealSubmission', () => {
      it('should throw an error when given a null value', async () => {
        appeal.appealSubmission = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSubmission must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSubmission;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSubmission.appealPDFStatement.uploadedFile.id is a required field',
          );
        }
      });
    });

    describe('appealSubmission.appealPDFStatement', () => {
      it('should throw an error when given a null value', async () => {
        appeal.appealSubmission.appealPDFStatement = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSubmission.appealPDFStatement must be a `object` type, but the final value was: `null`',
          );
        }
      });
    });

    describe('appealSiteSection', () => {
      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.healthAndSafety.hasIssues is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.siteAddress', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.siteAddress.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAddress = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAddress;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('appealSiteSection.siteAddress.postcode is a required field');
        }
      });
    });

    describe('appealSiteSection.siteAddress.addressLine1', () => {
      it('should throw an error when given a value with more than 60 characters', async () => {
        appeal.appealSiteSection.siteAddress.addressLine1 = 'a'.repeat(61);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.addressLine1 must be at most 60 characters',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAddress.addressLine1 = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.addressLine1 must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAddress.addressLine1;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.siteAddress.addressLine1 is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.siteAddress.addressLine2', () => {
      it('should throw an error when given a value with more than 60 characters', async () => {
        appeal.appealSiteSection.siteAddress.addressLine2 = 'a'.repeat(61);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.addressLine2 must be at most 60 characters',
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAddress.addressLine2 = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAddress.addressLine2;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteAddress.town', () => {
      it('should throw an error when given a value with more than 60 characters', async () => {
        appeal.appealSiteSection.siteAddress.town = 'a'.repeat(61);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.town must be at most 60 characters',
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAddress.town = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAddress.town;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteAddress.county', () => {
      it('should throw an error when given a value with more than 60 characters', async () => {
        appeal.appealSiteSection.siteAddress.county = 'a'.repeat(61);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.county must be at most 60 characters',
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAddress.county = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAddress.county;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteAddress.postcode', () => {
      it('should throw an error when given a value with more than 8 characters', async () => {
        appeal.appealSiteSection.siteAddress.postcode = 'a'.repeat(9);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.postcode must be at most 8 characters',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAddress.postcode = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAddress.postcode must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAddress.postcode;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual('appealSiteSection.siteAddress.postcode is a required field');
        }
      });
    });

    describe('appealSiteSection.siteOwnership', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.siteOwnership.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteOwnership = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteOwnership must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteOwnership;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.siteOwnership.ownsWholeSite is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.siteOwnership.ownsWholeSite', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.siteOwnership.ownsWholeSite = 'yes';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteOwnership.ownsWholeSite must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteOwnership.ownsWholeSite = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteOwnership.ownsWholeSite must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteOwnership.ownsWholeSite;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.siteOwnership.ownsWholeSite is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.siteOwnership.haveOtherOwnersBeenTold', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = 'yes';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteOwnership.haveOtherOwnersBeenTold must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteAccess', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.siteAccess.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAccess = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAccess must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAccess;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = 'yes';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.siteAccess.howIsSiteAccessRestricted', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = 'a'.repeat(256);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.siteAccess.howIsSiteAccessRestricted must be at most 255 characters',
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.healthAndSafety', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.healthAndSafety.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.healthAndSafety = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.healthAndSafety must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.healthAndSafety;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.healthAndSafety.hasIssues is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.healthAndSafety.hasIssues', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.healthAndSafety.hasIssues = 'yes';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.healthAndSafety.hasIssues must be a `boolean` type, but the final value was: `"yes"`',
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.healthAndSafety.hasIssues = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'appealSiteSection.healthAndSafety.hasIssues must be a `boolean` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.healthAndSafety.hasIssues;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.healthAndSafety.hasIssues is a required field',
          );
        }
      });
    });

    describe('appealSiteSection.healthAndSafety.healthAndSafetyIssues', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = 'a'.repeat(256);

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'appealSiteSection.healthAndSafety.healthAndSafetyIssues must be at most 255 characters',
          );
        }
      });

      it('should not throw an error when given a null value', async () => {
        appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = null;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues;

        const result = await householderAppeal.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('sectionStates', () => {
      it('should throw an error when given a null value', async () => {
        appeal.sectionStates = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.appealSiteSection.healthAndSafety is a required field',
          );
        }
      });
    });

    describe('sectionStates.aboutYouSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.aboutYouSection.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.aboutYouSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.aboutYouSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.aboutYouSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.aboutYouSection.yourDetails is a required field',
          );
        }
      });
    });

    describe('sectionStates.aboutYouSection.yourDetails', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.aboutYouSection.yourDetails = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.aboutYouSection.yourDetails must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.aboutYouSection.yourDetails = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.aboutYouSection.yourDetails must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.aboutYouSection.yourDetails;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.aboutYouSection.yourDetails is a required field',
          );
        }
      });
    });

    describe('sectionStates.requiredDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.requiredDocumentsSection.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.requiredDocumentsSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.requiredDocumentsSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.requiredDocumentsSection.decisionLetter is a required field',
          );
        }
      });
    });

    describe('sectionStates.requiredDocumentsSection.applicationNumber', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.requiredDocumentsSection.applicationNumber = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.requiredDocumentsSection.applicationNumber must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.requiredDocumentsSection.applicationNumber = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.requiredDocumentsSection.applicationNumber must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection.applicationNumber;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.requiredDocumentsSection.applicationNumber is a required field',
          );
        }
      });
    });

    describe('sectionStates.requiredDocumentsSection.originalApplication', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.requiredDocumentsSection.originalApplication = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.requiredDocumentsSection.originalApplication must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.requiredDocumentsSection.originalApplication = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.requiredDocumentsSection.originalApplication must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection.originalApplication;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.requiredDocumentsSection.originalApplication is a required field',
          );
        }
      });
    });

    describe('sectionStates.requiredDocumentsSection.decisionLetter', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.requiredDocumentsSection.decisionLetter = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.requiredDocumentsSection.decisionLetter must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.requiredDocumentsSection.decisionLetter = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.requiredDocumentsSection.decisionLetter must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection.decisionLetter;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.requiredDocumentsSection.decisionLetter is a required field',
          );
        }
      });
    });

    describe('sectionStates.yourAppealSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.yourAppealSection.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.yourAppealSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.yourAppealSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.yourAppealSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.yourAppealSection.otherDocuments is a required field',
          );
        }
      });
    });

    describe('sectionStates.yourAppealSection.appealStatement', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.yourAppealSection.appealStatement = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.yourAppealSection.appealStatement must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.yourAppealSection.appealStatement = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.yourAppealSection.appealStatement must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.yourAppealSection.appealStatement;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.yourAppealSection.appealStatement is a required field',
          );
        }
      });
    });

    describe('sectionStates.yourAppealSection.otherDocuments', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.yourAppealSection.otherDocuments = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.yourAppealSection.otherDocuments must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.yourAppealSection.otherDocuments = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.yourAppealSection.otherDocuments must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.yourAppealSection.otherDocuments;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.yourAppealSection.otherDocuments is a required field',
          );
        }
      });
    });

    describe('sectionStates.appealSiteSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.appealSiteSection.unknownField = 'unknown field';

        const result = await householderAppeal.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.appealSiteSection = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.appealSiteSection must be a `object` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.appealSiteSection.healthAndSafety is a required field',
          );
        }
      });
    });

    describe('sectionStates.appealSiteSection.siteAddress', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.siteAddress = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.appealSiteSection.siteAddress must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.appealSiteSection.siteAddress = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.appealSiteSection.siteAddress must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.siteAddress;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.appealSiteSection.siteAddress is a required field',
          );
        }
      });
    });

    describe('sectionStates.appealSiteSection.siteAccess', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.siteAccess = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.appealSiteSection.siteAccess must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.appealSiteSection.siteAccess = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.appealSiteSection.siteAccess must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.siteAccess;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.appealSiteSection.siteAccess is a required field',
          );
        }
      });
    });

    describe('sectionStates.appealSiteSection.siteOwnership', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.siteOwnership = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.appealSiteSection.siteOwnership must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.appealSiteSection.siteOwnership = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.appealSiteSection.siteOwnership must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.siteOwnership;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.appealSiteSection.siteOwnership is a required field',
          );
        }
      });
    });

    describe('sectionStates.appealSiteSection.healthAndSafety', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.healthAndSafety = 'PENDING';

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            `sectionStates.appealSiteSection.healthAndSafety must be one of the following values: ${Object.values(SECTION_STATE).join(', ')}`,
          );
        }
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.appealSiteSection.healthAndSafety = null;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toContain(
            'sectionStates.appealSiteSection.healthAndSafety must be a `string` type, but the final value was: `null`',
          );
        }
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.healthAndSafety;

        try {
          await householderAppeal.validate(appeal, config);
          throw new Error('Expected error not thrown');
        } catch (err) {
          expect(err.message).toEqual(
            'sectionStates.appealSiteSection.healthAndSafety is a required field',
          );
        }
      });
    });
  });
});
