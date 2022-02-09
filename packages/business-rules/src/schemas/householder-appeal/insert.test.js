const v8 = require('v8');
const appealData = require('../../../test/data/householder-appeal');
const insert = require('./insert');
const {
  APPEAL_ID,
  APPEAL_STATE,
  APPLICATION_DECISION,
  SECTION_STATE,
  TYPE_OF_PLANNING_APPLICATION,
} = require('../../constants');

describe('schemas/householder-appeal/insert', () => {
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
    });

    describe('submissionDate', () => {
      it('should throw an error when given a value which is in an incorrect format', async () => {
        appeal.submissionDate = '03/07/2021';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'Invalid Date or string not ISO format',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.submissionDate;

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

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.eligibility = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility must be a `object` type, but the final value was: `null`',
        );
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

    describe('eligibility.householderPlanningPermission', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          householderPlanningPermission: 'yes',
        };

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility.householderPlanningPermission must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.eligibility.householderPlanningPermission;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('eligibility.isClaimingCosts', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          isClaimingCosts: 'yes',
        };

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility.isClaimingCosts must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.eligibility.isClaimingCosts;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('eligibility.isListedBuilding', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.eligibility = {
          isListedBuilding: 'yes',
        };

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'eligibility.isListedBuilding must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.eligibility.isListedBuilding;

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
    });

    describe('aboutYouSection.yourDetails', () => {
      it('should throw an error when given a null value', async () => {
        appeal.aboutYouSection.yourDetails = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection.yourDetails must be a `object` type, but the final value was: `null`',
        );
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

    describe('aboutYouSection.yourDetails.name', () => {
      it('should throw an error when not given a string value', async () => {
        appeal.aboutYouSection.yourDetails.name = 123;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `aboutYouSection.yourDetails.name must match the following: "/^[a-z\\-' ]+$/i"`,
        );
      });

      it('should throw an error when given a value with less than 2 characters', async () => {
        appeal.aboutYouSection.yourDetails.name = 'a';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection.yourDetails.name must be at least 2 characters',
        );
      });

      it('should throw an error when given a value with more than 80 characters', async () => {
        appeal.aboutYouSection.yourDetails.name = 'a'.repeat(81);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection.yourDetails.name must be at most 80 characters',
        );
      });

      it('should throw an error when given a value with invalid characters', async () => {
        appeal.aboutYouSection.yourDetails.name = '!?<>';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `aboutYouSection.yourDetails.name must match the following: "/^[a-z\\-' ]+$/i"`,
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails.name;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('aboutYouSection.yourDetails.email', () => {
      it('should throw an error when not given an email value', async () => {
        appeal.aboutYouSection.yourDetails.email = 'apellant@example';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection.yourDetails.email must be a valid email',
        );
      });

      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.aboutYouSection.yourDetails.email = `${'a'.repeat(244)}@example.com`;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'aboutYouSection.yourDetails.email must be at most 255 characters',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.aboutYouSection.yourDetails.email;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
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

    describe('requiredDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.requiredDocumentsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.requiredDocumentsSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'requiredDocumentsSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('requiredDocumentsSection.applicationNumber', () => {
      it('should throw an error when given a value with more than 30 characters', async () => {
        appeal.requiredDocumentsSection.applicationNumber = 'a'.repeat(31);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'requiredDocumentsSection.applicationNumber must be at most 30 characters',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.requiredDocumentsSection.applicationNumber;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('requiredDocumentsSection.originalApplication', () => {
      it('should throw an error when not given a value', async () => {
        delete appeal2.requiredDocumentsSection.originalApplication;

        appeal.requiredDocumentsSection.originalApplication = {
          uploadedFile: {
            id: null,
            name: '',
            originalFileName: '',
          },
        };

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('requiredDocumentsSection.decisionLetter', () => {
      it('should not throw an error when not given a value', async () => {
        delete appeal2.requiredDocumentsSection.decisionLetter;

        appeal.requiredDocumentsSection.decisionLetter = {
          uploadedFile: {
            id: null,
            name: '',
            originalFileName: '',
          },
        };

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('yourAppealSection', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.appealStatement = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.appealStatement must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('yourAppealSection.appealStatement.hasSensitiveInformation', () => {
      it('should not throw an error when not given a value', async () => {
        delete appeal2.yourAppealSection.appealStatement;

        appeal.yourAppealSection.appealStatement = {
          hasSensitiveInformation: null,
          uploadedFile: {
            id: null,
            name: '',
            originalFileName: '',
          },
        };

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('yourAppealSection.otherDocuments', () => {
      it('should throw an error when given a null value', async () => {
        appeal.yourAppealSection.otherDocuments = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'yourAppealSection.otherDocuments must be a `object` type, but the final value was: `null`',
        );
      });

      // it('should throw an error when not given a value', async () => {
      //   delete appeal.yourAppealSection.otherDocuments;

      //   await expect(() => insert.validate(appeal, config)).rejects.toThrow(
      //     'yourAppealSection.otherDocuments.uploadedFiles[0].id is a required field',
      //   );
      // });
    });

    describe('appealSubmission', () => {
      it('should throw an error when given a null value', async () => {
        appeal.appealSubmission = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSubmission must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('appealSubmission.appealPDFStatement', () => {
      it('should not throw an error when not given a value', async () => {
        delete appeal2.appealSubmission.appealPDFStatement;

        appeal.appealSubmission.appealPDFStatement.uploadedFile = {
          id: null,
          name: '',
          originalFileName: '',
        };

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection', () => {
      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection must be a `object` type, but the final value was: `null`',
        );
      });
    });

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

    describe('appealSiteSection.siteOwnership', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.siteOwnership.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteOwnership = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.siteOwnership must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('appealSiteSection.siteOwnership.ownsWholeSite', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.siteOwnership.ownsWholeSite = 'yes';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.siteOwnership.ownsWholeSite must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteOwnership.ownsWholeSite;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteOwnership.haveOtherOwnersBeenTold', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = 'yes';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.siteOwnership.haveOtherOwnersBeenTold must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteAccess', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.siteAccess.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.siteAccess = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.siteAccess must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = 'yes';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.siteAccess.howIsSiteAccessRestricted', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = 'a'.repeat(256);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.siteAccess.howIsSiteAccessRestricted must be at most 255 characters',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.healthAndSafety', () => {
      it('should remove unknown fields', async () => {
        appeal2.appealSiteSection.healthAndSafety.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.appealSiteSection.healthAndSafety = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.healthAndSafety must be a `object` type, but the final value was: `null`',
        );
      });
    });

    describe('appealSiteSection.healthAndSafety.hasIssues', () => {
      it('should throw an error when not given a boolean value', async () => {
        appeal.appealSiteSection.healthAndSafety.hasIssues = 'yes';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.healthAndSafety.hasIssues must be a `boolean` type, but the final value was: `"yes"`',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.healthAndSafety.hasIssues;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('appealSiteSection.healthAndSafety.healthAndSafetyIssues', () => {
      it('should throw an error when given a value with more than 255 characters', async () => {
        appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = 'a'.repeat(256);

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'appealSiteSection.healthAndSafety.healthAndSafetyIssues must be at most 255 characters',
        );
      });

      it('should not throw an error when not given a value', async () => {
        delete appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues;

        const result = await insert.validate(appeal, config);
        expect(result).toEqual(appeal);
      });
    });

    describe('sectionStates', () => {
      it('should throw an error when given a null value', async () => {
        appeal.sectionStates = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates must be a `object` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.appealSiteSection.healthAndSafety is a required field',
        );
      });
    });

    describe('sectionStates.aboutYouSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.aboutYouSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.aboutYouSection = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.aboutYouSection must be a `object` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.aboutYouSection;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.aboutYouSection.yourDetails is a required field',
        );
      });
    });

    describe('sectionStates.aboutYouSection.yourDetails', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.aboutYouSection.yourDetails = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.aboutYouSection.yourDetails must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when given a null value', async () => {
        appeal.sectionStates.aboutYouSection.yourDetails = null;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.aboutYouSection.yourDetails must be a `string` type, but the final value was: `null`',
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.aboutYouSection.yourDetails;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.aboutYouSection.yourDetails is a required field',
        );
      });
    });

    describe('sectionStates.requiredDocumentsSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.requiredDocumentsSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.requiredDocumentsSection.decisionLetter is a required field',
        );
      });
    });

    describe('sectionStates.requiredDocumentsSection.applicationNumber', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.requiredDocumentsSection.applicationNumber = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.requiredDocumentsSection.applicationNumber must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection.applicationNumber;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.requiredDocumentsSection.applicationNumber is a required field',
        );
      });
    });

    describe('sectionStates.requiredDocumentsSection.originalApplication', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.requiredDocumentsSection.originalApplication = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.requiredDocumentsSection.originalApplication must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection.originalApplication;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.requiredDocumentsSection.originalApplication is a required field',
        );
      });
    });

    describe('sectionStates.requiredDocumentsSection.decisionLetter', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.requiredDocumentsSection.decisionLetter = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.requiredDocumentsSection.decisionLetter must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.requiredDocumentsSection.decisionLetter;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.requiredDocumentsSection.decisionLetter is a required field',
        );
      });
    });

    describe('sectionStates.yourAppealSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.yourAppealSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.yourAppealSection;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.yourAppealSection.otherDocuments is a required field',
        );
      });
    });

    describe('sectionStates.yourAppealSection.appealStatement', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.yourAppealSection.appealStatement = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.yourAppealSection.appealStatement must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.yourAppealSection.appealStatement;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.yourAppealSection.appealStatement is a required field',
        );
      });
    });

    describe('sectionStates.yourAppealSection.otherDocuments', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.yourAppealSection.otherDocuments = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.yourAppealSection.otherDocuments must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.yourAppealSection.otherDocuments;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.yourAppealSection.otherDocuments is a required field',
        );
      });
    });

    describe('sectionStates.appealSiteSection', () => {
      it('should remove unknown fields', async () => {
        appeal2.sectionStates.appealSiteSection.unknownField = 'unknown field';

        const result = await insert.validate(appeal2, config);
        expect(result).toEqual(appeal);
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.appealSiteSection.healthAndSafety is a required field',
        );
      });
    });

    describe('sectionStates.appealSiteSection.siteAddress', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.siteAddress = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.appealSiteSection.siteAddress must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.siteAddress;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.appealSiteSection.siteAddress is a required field',
        );
      });
    });

    describe('sectionStates.appealSiteSection.siteAccess', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.siteAccess = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.appealSiteSection.siteAccess must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.siteAccess;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.appealSiteSection.siteAccess is a required field',
        );
      });
    });

    describe('sectionStates.appealSiteSection.siteOwnership', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.siteOwnership = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.appealSiteSection.siteOwnership must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.siteOwnership;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.appealSiteSection.siteOwnership is a required field',
        );
      });
    });

    describe('sectionStates.appealSiteSection.healthAndSafety', () => {
      it('should throw an error when given an invalid value', async () => {
        appeal.sectionStates.appealSiteSection.healthAndSafety = 'PENDING';

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          `sectionStates.appealSiteSection.healthAndSafety must be one of the following values: ${Object.values(
            SECTION_STATE,
          ).join(', ')}`,
        );
      });

      it('should throw an error when not given a value', async () => {
        delete appeal.sectionStates.appealSiteSection.healthAndSafety;

        await expect(() => insert.validate(appeal, config)).rejects.toThrow(
          'sectionStates.appealSiteSection.healthAndSafety is a required field',
        );
      });
    });
  });
});
