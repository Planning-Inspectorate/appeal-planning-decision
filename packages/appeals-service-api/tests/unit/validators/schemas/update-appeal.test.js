const { updateAppeal } = require('../../../../src/validators/appeals/schemas/update-appeal');
const { appealDocument } = require('../../../../src/models/appeal');

describe('appeals.validators.schemas', () => {
  let appeal;

  const appealId = 'f40a7073-b1fc-445a-acf5-2035c6b1791e';

  beforeEach(() => {
    appeal = JSON.parse(JSON.stringify(appealDocument));
    appeal.id = appealId;

    jest.resetAllMocks();
  });

  describe('updateAppeal', () => {
    test('should accept the appeal - empty', async () => {
      try {
        appeal = await updateAppeal.validate({}, { abortEarly: false });
      } catch (apiError) {
        throw new Error(apiError.errors);
      }

      expect(appeal).toEqual({});
    });

    test('should ignore unknown fields', async () => {
      const appealModification = {
        unknownField1: 'test1',
        unknownField2: 'test2',
        unknownField3: 'test3',
      };
      appeal = await updateAppeal.validate(appealModification, { abortEarly: false });
      expect(appeal).toEqual({});
    });

    test('should accept the appeal - id update - good', async () => {
      const appealModification = {
        id: '89aa8504-773c-42be-bb68-029716ad9756',
      };

      try {
        appeal = await updateAppeal.validate(appealModification, { abortEarly: false });
      } catch (apiError) {
        throw new Error(apiError.errors);
      }

      expect(appeal).toEqual(appealModification);
    });

    test('should reject the appeal - id update - bad format', async () => {
      const appealModification = {
        id: 'test',
      };

      try {
        appeal = await updateAppeal.validate(appealModification, { abortEarly: false });
      } catch (apiError) {
        expect(apiError.errors).toContain('id must be a valid UUID');
        return;
      }

      throw new Error('Should not been validated');
    });

    test('should accept the appeal - horizonId update - horizonId', async () => {
      const appealModification = {
        horizonId: 'x'.repeat(20),
      };

      try {
        appeal = await updateAppeal.validate(appealModification, { abortEarly: false });
      } catch (apiError) {
        throw new Error(apiError.errors);
      }

      expect(appeal).toEqual(appealModification);
    });

    test('should reject the appeal - horizonId - too long', async () => {
      const appealModification = {
        horizonId: 'x'.repeat(21),
      };

      try {
        appeal = await updateAppeal.validate(appealModification, { abortEarly: false });
      } catch (apiError) {
        expect(apiError.errors).toContain('horizonId must be at most 20 characters');
        return;
      }

      throw new Error('Should not been validated');
    });

    test('should reject the appeal - sectionStates - required', async () => {
      const appealModification = {
        sectionStates: {},
      };

      try {
        appeal = await updateAppeal.validate(appealModification, { abortEarly: false });
      } catch (result) {
        expect(result.errors.length).toEqual(9);
        expect(result.errors).toEqual(
          expect.arrayContaining([
            'sectionStates.aboutYouSection.yourDetails is a required field',
            'sectionStates.requiredDocumentsSection.applicationNumber is a required field',
            'sectionStates.requiredDocumentsSection.originalApplication is a required field',
            'sectionStates.requiredDocumentsSection.decisionLetter is a required field',
            'sectionStates.yourAppealSection.appealStatement is a required field',
            'sectionStates.yourAppealSection.otherDocuments is a required field',
            'sectionStates.appealSiteSection.siteAccess is a required field',
            'sectionStates.appealSiteSection.siteOwnership is a required field',
            'sectionStates.appealSiteSection.healthAndSafety is a required field',
          ])
        );
        return;
      }

      throw new Error('Should not been validated');
    });
  });
});
