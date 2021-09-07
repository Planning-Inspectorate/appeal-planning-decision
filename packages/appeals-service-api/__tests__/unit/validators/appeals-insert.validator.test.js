const { insertAppeal } = require('../../../src/validators/appeals/schemas/insert-appeal');
const { appealDocument } = require('../../../src/models/appeal');
const valueAppeal = require('../value-appeal');

describe('appeals.validators.schemas', () => {
  let appeal;

  const appealId = 'f40a7073-b1fc-445a-acf5-2035c6b1791e';

  beforeEach(() => {
    appeal = JSON.parse(JSON.stringify(appealDocument));
    appeal.id = appealId;

    jest.resetAllMocks();
  });

  describe('insertAppeal', () => {
    test('should reject the appeal', async () => {
      try {
        appeal = await insertAppeal.validate({}, { abortEarly: false });
      } catch (result) {
        expect(result.errors.length).toEqual(11);
        expect(result.errors).toEqual(
          expect.arrayContaining([
            'id is a required field',
            'sectionStates.aboutYouSection.yourDetails is a required field',
            'sectionStates.requiredDocumentsSection.applicationNumber is a required field',
            'sectionStates.requiredDocumentsSection.originalApplication is a required field',
            'sectionStates.requiredDocumentsSection.decisionLetter is a required field',
            'sectionStates.yourAppealSection.appealStatement is a required field',
            'sectionStates.yourAppealSection.otherDocuments is a required field',
            'sectionStates.appealSiteSection.siteAddress is a required field',
            'sectionStates.appealSiteSection.siteAccess is a required field',
            'sectionStates.appealSiteSection.siteOwnership is a required field',
            'sectionStates.appealSiteSection.healthAndSafety is a required field',
          ])
        );

        return;
      }
      throw new Error('Should not been validated');
    });

    test('should validate the appeal and reject unknown fields', async () => {
      valueAppeal(appeal);

      appeal.unknownField = true;

      appeal = await insertAppeal.validate(appeal, { abortEarly: false });
      expect(appeal.id).toEqual(appeal.id);
      expect(appeal.unknownField).toBeUndefined();
    });
  });
});
