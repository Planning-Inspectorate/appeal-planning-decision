const { appealDocument } = require('../../../src/models/appeal');
const { updateAppeal, validateAppeal } = require('../../../src/services/appeal.service');
const valueAppeal = require('../value-appeal');
const mongodb = require('../../../src/db/db');
const queue = require('../../../src/lib/queue');
const notify = require('../../../src/lib/notify');
const fullAppealNotify = require('../../../src/lib/full-appeal/notify');
const { APPEAL_TYPE } = require('../../../src/constants');

jest.mock('../../../src/db/db');
jest.mock('../../../src/lib/queue');
jest.mock('../../../src/lib/notify');
jest.mock('../../../src/lib/full-appeal/notify');
jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({}));

describe('services/validation.service', () => {
  let appeal;
  const appealId = 'f40a7073-b1fc-445a-acf5-2035c6b1791e';

  beforeEach(() => {
    appeal = JSON.parse(JSON.stringify(appealDocument));
    valueAppeal(appeal);
    appeal.id = appealId;

    jest.resetAllMocks();
  });

  describe('validateAppeal', () => {
    test('Appeal cannot be SUBMITTED if any sections are not COMPLETED', async () => {
      appeal.state = 'SUBMITTED';
      appeal.sectionStates.aboutYouSection.yourDetails = 'NOT STARTED';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal state cannot be SUBMITTED if any sections except Other Documents are not COMPLETED'
      );
    });

    test('Appeal appellant name must be valued if email is.', async () => {
      appeal.aboutYouSection.yourDetails.email = 'jim@john.com';
      appeal.aboutYouSection.yourDetails.name = '';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal appellant details must have email and name valued.The name is missing.'
      );
    });

    test('Appeal appellant email must be valued if name is.', async () => {
      appeal.aboutYouSection.yourDetails.email = '';
      appeal.aboutYouSection.yourDetails.name = 'Jim John';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal appellant details must have email and name valued.The email is missing.'
      );
    });

    test('Appeal statement upload file cannot have name without id', async () => {
      appeal.yourAppealSection.appealStatement.uploadedFile.name =
        'my_uploaded_file_appeal_statement.pdf';
      appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName =
        'my_uploaded_file_appeal_statement.pdf';
      appeal.yourAppealSection.appealStatement.uploadedFile.id = null;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal statement uploaded file must have an id for the file when it has a name'
      );
    });

    test('Appeal statement upload file cannot have id without name', async () => {
      appeal.yourAppealSection.appealStatement.uploadedFile.name = '';
      appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName = 'a file name';
      appeal.yourAppealSection.appealStatement.uploadedFile.id =
        '3fa85f64-5717-4562-b3fc-2c963f66afa6';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal statement uploaded file must have a name for the file when it has an id'
      );
    });

    test('Appeal statement upload file cannot have sensitive information', async () => {
      appeal.yourAppealSection.appealStatement.uploadedFile.name =
        'my_uploaded_file_appeal_statement.pdf';
      appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName =
        'my_uploaded_file_appeal_statement.pdf';
      appeal.yourAppealSection.appealStatement.uploadedFile.id =
        '3fa85f64-5717-4562-b3fc-2c963f66afa6';
      appeal.yourAppealSection.appealStatement.hasSensitiveInformation = true;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal statement uploaded file cannot be accepted unless it is confirmed to have no sensitive information'
      );
    });

    test('Appeal statement upload file must include answer to sensitive information question', async () => {
      appeal.yourAppealSection.appealStatement.uploadedFile.name =
        'my_uploaded_file_appeal_statement.pdf';
      appeal.yourAppealSection.appealStatement.uploadedFile.originalFileName =
        'my_uploaded_file_appeal_statement.pdf';
      appeal.yourAppealSection.appealStatement.uploadedFile.id =
        '3fa85f64-5717-4562-b3fc-2c963f66afa6';
      appeal.yourAppealSection.appealStatement.hasSensitiveInformation = null;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal statement uploaded file cannot be accepted unless it is confirmed to have no sensitive information'
      );
    });

    test('supporting document files should have both id and names', async () => {
      appeal.yourAppealSection.otherDocuments.uploadedFiles = [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'filename-1',
          originalFileName: 'filename-1',
        },
        { id: null, name: 'filename-2', originalFileName: 'filename-2' },
        { id: '3fa85f64-5717-4562-b3fc-2c963f66afa8', name: '', originalFileName: '' },
      ];

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The supporting document must have id and name valued.The id is missing. name=filename-2'
      );
      expect(errors).toContain(
        'The supporting document must have id and name valued.The name is missing. id=3fa85f64-5717-4562-b3fc-2c963f66afa8'
      );
    });

    test('original planning application upload file cannot have name without id', async () => {
      appeal.requiredDocumentsSection.originalApplication.uploadedFile.name =
        'my_uploaded_file_planning_application.pdf';
      appeal.requiredDocumentsSection.originalApplication.uploadedFile.originalFileName =
        'my_uploaded_file_planning_application.pdf';
      appeal.requiredDocumentsSection.originalApplication.uploadedFile.id = null;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The planning application uploaded file must have an id for the file when it has a name'
      );
    });

    test('original planning application upload file cannot have id without name', async () => {
      appeal.requiredDocumentsSection.originalApplication.uploadedFile.name = '';
      appeal.requiredDocumentsSection.originalApplication.uploadedFile.originalFileName = '';
      appeal.requiredDocumentsSection.originalApplication.uploadedFile.id =
        '3fa85f64-5717-4562-b3fc-2c963f66afa7';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The planning application uploaded file must have a name for the file when it has an id'
      );
    });
    test('decision letter upload file cannot have name without id', async () => {
      appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name =
        'my_uploaded_file_planning_application.pdf';
      appeal.requiredDocumentsSection.decisionLetter.uploadedFile.originalFileName =
        'my_uploaded_file_planning_application.pdf';
      appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id = null;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The decision letter uploaded file must have an id for the file when it has a name'
      );
    });

    test('decision letter upload file cannot have id without name', async () => {
      appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name = '';
      appeal.requiredDocumentsSection.decisionLetter.uploadedFile.originalFileName = '';
      appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id =
        '3fa85f64-5717-4562-b3fc-2c963f66afa7';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The decision letter uploaded file must have a name for the file when it has an id'
      );
    });

    // test('appeal statement pdf upload file cannot have name without id', async () => {
    //   appeal.appealSubmission.appealPDFStatement.uploadedFile.name =
    //     'c9ce252a-9843-45d9-ab3c-a80590a38282.pdf';
    //   appeal.appealSubmission.appealPDFStatement.uploadedFile.originalFileName =
    //     'c9ce252a-9843-45d9-ab3c-a80590a38282.pdf';
    //   appeal.appealSubmission.appealPDFStatement.uploadedFile.id = null;
    //
    //   const errors = validateAppeal(appeal);
    //
    //   expect(errors).toContain(
    //     'The appeal statement pdf uploaded file must have an id for the file when it has a name'
    //   );
    // });
    //
    // test('appeal statement pdf upload file cannot have id without name', async () => {
    //   appeal.appealSubmission.appealPDFStatement.uploadedFile = {
    //     id: 'c9ce252a-9843-45d9-ab3c-a80590a38282',
    //     name: '',
    //     originalFileName: '',
    //   };
    //
    //   const errors = validateAppeal(appeal);
    //
    //   expect(errors).toContain(
    //     'The appeal statement pdf uploaded file must have a name for the file when it has an id'
    //   );
    // });

    [
      {
        addressLine1: '',
        postcode: 'postcode',
      },
      {
        addressLine1: 'addressLine1',
        postcode: '',
      },
    ].forEach((siteAddress) => {
      test('the site address should see all its mandatory fields valued or none of them, other it should fail', async () => {
        appeal.appealSiteSection.siteAddress = siteAddress;

        const siteAddressErrorMessage = `The appeal appellant site address must have addressLine1 and postcode valued.
    addressLine1=${appeal.appealSiteSection.siteAddress.addressLine1}
    postcode=${appeal.appealSiteSection.siteAddress.postcode}`;

        const errors = validateAppeal(appeal);

        expect(errors).toContain(siteAddressErrorMessage);
      });
    });

    test('the appellant owning the whole site but still told other owners should fail', async () => {
      appeal.appealSiteSection.siteOwnership.ownsWholeSite = true;
      appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = true;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'If the appellant owns the whole appeal site there can be no other owners'
      );
    });

    test('other owner told without knowing if there is any should fail', async () => {
      appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = true;
      appeal.appealSiteSection.siteOwnership.ownsWholeSite = null;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'We should know if there is another owners before knowing if they were told'
      );
    });

    test('the health and safety has issues and they should be provided', async () => {
      appeal.appealSiteSection.healthAndSafety.hasIssues = true;
      appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = '';

      const errors = validateAppeal(appeal);

      expect(errors).toContain('If the health and safety task has issues, they need to be valued');
    });

    test('the health and safety has no issues and they should not be provided', async () => {
      appeal.appealSiteSection.healthAndSafety.hasIssues = false;
      appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues = 'Some issues';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'The appeal does not states that there is health and safety issues but the field is valued'
      );
    });

    test('If appeal site is visible from the public road then site access restrictions is not required', async () => {
      appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = true;
      appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = 'Big gaping hole';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'If appeal site is visible from the public road then site access restrictions is not required'
      );
    });

    test('If appeal site is not visible from the public road then site access restrictions is required', async () => {
      appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = false;
      appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = null;

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'If appeal site is not visible from the public road then site access restrictions is required'
      );
    });

    test('If appeal site from public road is null then site access restrictions must be null or empty', async () => {
      appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad = null;

      appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted = 'Not null or empty';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'If appeal site from public road is null then site access restrictions must be null or empty'
      );
    });

    test('Appeal has been entered by agent acting on behalf of applicant and must have an Appealing on Behalf Applicant Name', async () => {
      appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
      appeal.aboutYouSection.yourDetails.isOriginalApplicant = false;
      appeal.aboutYouSection.yourDetails.appealingOnBehalfOf = '';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'Appeal has been entered by agent acting on behalf of applicant and must have an Appealing on Behalf Applicant Name'
      );
    });

    test('Appellant name cannot be empty and must be specified', async () => {
      appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
      appeal.aboutYouSection.yourDetails.name = '';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'If your details section is completed then appellant name cannot be null or empty and it must be specified'
      );
    });

    test('Appellant email address cannot be empty and must be specified', async () => {
      appeal.sectionStates.aboutYouSection.yourDetails = 'COMPLETED';
      appeal.aboutYouSection.yourDetails.email = '';

      const errors = validateAppeal(appeal);

      expect(errors).toContain(
        'If your details section is completed then appellant email address cannot be null or empty and it must be specified'
      );
    });
  });

  describe('updateAppeal', () => {
    let updatedAppeal;

    beforeEach(() => {
      updatedAppeal = JSON.parse(JSON.stringify(appeal));

      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          findOneAndUpdate: jest.fn().mockResolvedValue({
            value: updatedAppeal,
          }),
        })),
      }));
    });

    test('isFirstSubmission is false', async () => {
      const outcome = await updateAppeal(appeal, false);
      expect(outcome).toEqual(updatedAppeal);
      expect(appeal.submissionDate).toBe(null);
      expect(queue.addAppeal).not.toHaveBeenCalled();
      expect(notify.sendAppealSubmissionConfirmationEmailToAppellant).not.toHaveBeenCalled();
      expect(notify.sendAppealSubmissionReceivedNotificationEmailToLpa).not.toHaveBeenCalled();
    });

    test('isFirstSubmission is true', async () => {
      const outcome = await updateAppeal(appeal, true);
      expect(outcome).toEqual(updatedAppeal);
      expect(appeal.submissionDate).not.toBe(null);
      expect(queue.addAppeal).toHaveBeenCalledWith(updatedAppeal);
      expect(notify.sendAppealSubmissionConfirmationEmailToAppellant).toHaveBeenCalledWith(
        appeal.value
      );
      expect(notify.sendAppealSubmissionReceivedNotificationEmailToLpa).toHaveBeenCalledWith(
        appeal.value
      );
    });

    test('isFirstSubmission is true for full-appeal', async () => {
      const fullAppeal = {
        ...appeal,
        appealType: APPEAL_TYPE.PLANNING_SECTION_78,
      };

      updatedAppeal = JSON.parse(JSON.stringify(fullAppeal));

      mongodb.get = jest.fn(() => ({
        collection: jest.fn(() => ({
          findOneAndUpdate: jest.fn().mockResolvedValue({
            value: {
              appeal: updatedAppeal,
            },
          }),
        })),
      }));

      const outcome = await updateAppeal(fullAppeal, true);
      expect(outcome).toEqual({ appeal: updatedAppeal });
      expect(fullAppeal.submissionDate).not.toBe(null);
      expect(queue.addAppeal).toHaveBeenCalledWith({ appeal: updatedAppeal });
      expect(
        fullAppealNotify.sendAppealSubmissionConfirmationEmailToAppellant
      ).toHaveBeenCalledWith(updatedAppeal);
      expect(
        fullAppealNotify.sendAppealSubmissionReceivedNotificationEmailToLpa
      ).toHaveBeenCalledWith(updatedAppeal);
    });
  });
});
