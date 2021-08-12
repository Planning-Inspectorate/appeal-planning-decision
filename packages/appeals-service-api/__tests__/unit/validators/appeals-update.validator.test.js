const mockIsAppealSubmitted = jest.fn();

jest.doMock('../../../src/services/appeal.service', () => ({
  isAppealSubmitted: mockIsAppealSubmitted,
}));

const { appealDocument } = require('../../../src/models/appeal');
const { mockReq, mockRes } = require('../mocks');
const {
  appealUpdateValidationRules,
} = require('../../../src/validators/appeals/appeals.validator');

const ApiError = require('../../../src/error/apiError');

describe('appeals.validators.schemas', () => {
  let req;
  let res;
  let appeal;

  const appealId = 'f40a7073-b1fc-445a-acf5-2035c6b1791e';

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    appeal = JSON.parse(JSON.stringify(appealDocument));
    appeal.id = appealId;

    jest.resetAllMocks();
  });

  describe('updateAppeal', () => {
    const tests = [
      {
        title: 'accepted - empty',
        given: () => ({}),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
          expect(result.appeal).toEqual({});
        },
      },

      {
        title: 'accepted - should ignore unknown fields',
        given: () => ({
          unknownField1: 'test1',
          unknownField2: 'test2',
          unknownField3: 'test3',
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
          expect(result.appeal).toEqual({});
        },
      },
      {
        title: 'accepted - id update - good',
        given: () => ({
          id: appealId,
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - id update - not same as request',
        given: () => ({
          id: '89aa8504-773c-42be-bb68-029716ad9756',
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain(
            'The provided id in path must be the same as the appeal id in the request body'
          );
        },
      },
      {
        title: 'rejected -- id update - bad format',
        given: () => ({
          id: 'test',
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain('id must be a valid UUID');
        },
      },
      {
        title: 'accepted - horizonId',
        given: () => ({
          horizonId: 'x'.repeat(20),
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - horizonId - too long',
        given: () => ({
          horizonId: 'x'.repeat(21),
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain('horizonId must be at most 20 characters');
        },
      },
      {
        title: 'accepted - lpaCode',
        given: () => ({
          lpaCode: 'x'.repeat(20),
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },

      {
        title: 'rejected - lpaCode - too long',
        given: () => ({
          lpaCode: 'x'.repeat(21),
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain('lpaCode must be at most 20 characters');
        },
      },
      {
        title: 'accepted - decisionDate - iso string format',
        given: () => ({
          decisionDate: '2022-01-01T12:00:00.000Z',
        }),
        expected: (result) => {
          expect(result.appeal.decisionDate).toEqual(new Date('2022-01-01T12:00:00.000Z'));
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'accepted - decisionDate - date format',
        given: () => ({
          decisionDate: new Date('2022-01-01T12:00:00.000Z'),
        }),
        expected: (result) => {
          expect(result.appeal.decisionDate).toEqual(new Date('2022-01-01T12:00:00.000Z'));
          expect(result.errors.length).toEqual(0);
        },
      },

      {
        title: 'rejected - decisionDate - non iso string',
        given: () => ({
          decisionDate: '2022-01-01',
        }),
        expected: (result) => {
          expect(result.appeal.decisionDate).toBeNull();
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('Invalid Date or string not ISO format');
        },
      },
      {
        title: 'rejected - decisionDate - invalid date',
        given: () => ({
          decisionDate: 'Today',
        }),
        expected: (result) => {
          expect(result.appeal.decisionDate).toBeNull();
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('Invalid Date or string not ISO format');
        },
      },
      {
        title: 'accepted - state - DRAFT',
        given: () => ({
          state: 'DRAFT',
        }),
        expected: (result) => {
          expect(result.appeal.state).toEqual('DRAFT');
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'accepted - state - SUBMITTED',
        given: () => ({
          state: 'SUBMITTED',
        }),
        expected: (result) => {
          expect(result.appeal.state).toEqual('SUBMITTED');
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - state - unknown state',
        given: () => ({
          state: 'STARTED',
        }),
        expected: (result) => {
          expect(result.appeal.state).toEqual('DRAFT');
          expect(result.errors.length).toEqual(1);
        },
      },
      {
        title: 'rejected - lpaCode - too long',
        given: () => ({
          lpaCode: 'x'.repeat(21),
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain('lpaCode must be at most 20 characters');
        },
      },
      {
        title: 'accepted - eligibility - empty object',
        given: () => ({
          eligibility: {},
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - eligibility - empty list',
        given: () => ({
          eligibility: [],
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('eligibility must be a `object` type');
        },
      },
    ];

    [true, false, 1, 0].forEach((value) => {
      tests.push({
        title: `accepted - eligibility - good values - unknown fields ignored ${value}`,
        given: () => ({
          eligibility: {
            unknownField: false,
            enforcementNotice: value,
            householderPlanningPermission: value,
            isClaimingCosts: value,
            isListedBuilding: value,
          },
        }),
        expected: (result) => {
          expect(result.appeal.eligibility.unknownField).toBeUndefined();
          expect(result.errors.length).toEqual(0);
        },
      });
    });

    [null, 'very true', 2].forEach((value) => {
      tests.push({
        title: `rejected - eligibility - bad values ${value}`,
        given: () => ({
          eligibility: {
            enforcementNotice: value,
            householderPlanningPermission: value,
            isClaimingCosts: value,
            isListedBuilding: value,
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(4);
        },
      });
    });

    tests.push(
      {
        title: 'accepted - aboutYouSection - empty object',
        given: () => ({
          aboutYouSection: {},
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - aboutYouSection - empty list',
        given: () => ({
          aboutYouSection: [],
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('aboutYouSection must be a `object` type');
        },
      },
      {
        title: 'accepted - aboutYouSection.yourDetails - empty object',
        given: () => ({
          aboutYouSection: { yourDetails: {} },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - aboutYouSection.yourDetails - empty list',
        given: () => ({
          aboutYouSection: { yourDetails: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('aboutYouSection.yourDetails must be a `object` type');
        },
      },
      {
        title: 'accepted - aboutYouSection.yourDetails - good values',
        given: () => ({
          aboutYouSection: {
            yourDetails: {
              isOriginalApplicant: true,
              appealingOnBehalfOf: 'Zorro',
              name: 'Bernardo',
              email: 'bernardo@gmail.com',
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - aboutYouSection.yourDetails - bad values',
        given: () => ({
          aboutYouSection: {
            yourDetails: {
              isOriginalApplicant: 2,
              appealingOnBehalfOf: 'Z0rr0',
              name: 'Bernard0',
              email: 'bernardoAtGmail.com',
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(4);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'aboutYouSection.yourDetails.isOriginalApplicant must be a `boolean` type, but the final value was: `2`.',
              'aboutYouSection.yourDetails.name must match the following: "/^[a-z\\-\' ]+$/i"',
              'aboutYouSection.yourDetails.appealingOnBehalfOf must match the following: "/^[a-z\\-\' ]+$/i"',
              'aboutYouSection.yourDetails.email must be a valid email',
            ])
          );
        },
      },
      {
        title: 'rejected - aboutYouSection.yourDetails - required',
        given: () => ({
          aboutYouSection: {
            yourDetails: {
              isOriginalApplicant: null,
              name: null,
              email: null,
              appealingOnBehalfOf: null,
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(3);
        },
      },
      {
        title: 'rejected - aboutYouSection.yourDetails - bad values',
        given: () => ({
          aboutYouSection: {
            yourDetails: {
              isOriginalApplicant: 1,
              appealingOnBehalfOf: 'Zorro',
              name: 'Bernardo',
              email: 'bernardo@gmail.com',
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },

      {
        title: 'accepted - requiredDocumentsSection - empty object',
        given: () => ({
          requiredDocumentsSection: {},
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - requiredDocumentsSection - empty list',
        given: () => ({
          requiredDocumentsSection: [],
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('requiredDocumentsSection must be a `object` type');
        },
      },
      {
        title: 'rejected - applicationNumber - required',
        given: () => ({
          requiredDocumentsSection: { applicationNumber: '' },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain(
            'requiredDocumentsSection.applicationNumber is a required field'
          );
        },
      },
      {
        title: 'accepted - applicationNumber',
        given: () => ({
          requiredDocumentsSection: { applicationNumber: 'x'.repeat(30) },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },

      {
        title: 'rejected - applicationNumber - too long',
        given: () => ({
          requiredDocumentsSection: { applicationNumber: 'x'.repeat(31) },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors).toContain(
            'requiredDocumentsSection.applicationNumber must be at most 30 characters'
          );
        },
      },
      {
        title: 'rejected - requiredDocumentsSection.originalApplication - empty list',
        given: () => ({
          requiredDocumentsSection: { originalApplication: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'requiredDocumentsSection.originalApplication must be a `object` type'
          );
        },
      },
      {
        title: 'accepted - requiredDocumentsSection.originalApplication - valid document',
        given: () => ({
          requiredDocumentsSection: {
            originalApplication: {
              uploadedFile: {
                name: 'name of the document',
                originalFileName: 'name of the document',
                id: appealId,
              },
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - requiredDocumentsSection.originalApplication - required',
        given: () => ({
          requiredDocumentsSection: { originalApplication: {} },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(3);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'requiredDocumentsSection.originalApplication.uploadedFile.name is a required field',
              'requiredDocumentsSection.originalApplication.uploadedFile.originalFileName is a required field',
              'requiredDocumentsSection.originalApplication.uploadedFile.id is a required field',
            ])
          );
        },
      },
      {
        title: 'accepted - requiredDocumentsSection.originalApplication',
        given: () => ({
          requiredDocumentsSection: { originalApplication: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'requiredDocumentsSection.originalApplication must be a `object` type'
          );
        },
      },
      {
        title:
          'rejected - requiredDocumentsSection.originalApplication - file id not uuid format, name missing',
        given: () => ({
          requiredDocumentsSection: {
            originalApplication: {
              uploadedFile: {
                id: 'this not a good uuid',
                originalFileName: 'name of the document',
              },
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(2);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'requiredDocumentsSection.originalApplication.uploadedFile.id must be a valid UUID',
              'requiredDocumentsSection.originalApplication.uploadedFile.name is a required field',
            ])
          );
        },
      },
      {
        title: 'rejected - requiredDocumentsSection.decisionLetter - empty list',
        given: () => ({
          requiredDocumentsSection: { decisionLetter: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'requiredDocumentsSection.decisionLetter must be a `object` type'
          );
        },
      },
      {
        title: 'accepted - requiredDocumentsSection.decisionLetter - valid document',
        given: () => ({
          requiredDocumentsSection: {
            decisionLetter: {
              uploadedFile: {
                name: 'name of the document',
                originalFileName: 'name of the document',
                id: appealId,
              },
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - requiredDocumentsSection.decisionLetter - required',
        given: () => ({
          requiredDocumentsSection: { decisionLetter: {} },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(3);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'requiredDocumentsSection.decisionLetter.uploadedFile.name is a required field',
              'requiredDocumentsSection.decisionLetter.uploadedFile.originalFileName is a required field',
              'requiredDocumentsSection.decisionLetter.uploadedFile.id is a required field',
            ])
          );
        },
      },
      {
        title: 'rejected - requiredDocumentsSection.decisionLetter',
        given: () => ({
          requiredDocumentsSection: { decisionLetter: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'requiredDocumentsSection.decisionLetter must be a `object` type'
          );
        },
      },
      {
        title:
          'rejected - requiredDocumentsSection.decisionLetter - file id not uuid format, name missing',
        given: () => ({
          requiredDocumentsSection: {
            decisionLetter: {
              uploadedFile: {
                id: 'this not a good uuid',
                originalFileName: 'a file name',
              },
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(2);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'requiredDocumentsSection.decisionLetter.uploadedFile.id must be a valid UUID',
              'requiredDocumentsSection.decisionLetter.uploadedFile.name is a required field',
            ])
          );
        },
      },

      {
        title: 'accepted - yourAppealSection - empty object',
        given: () => ({
          yourAppealSection: {},
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - yourAppealSection - empty list',
        given: () => ({
          yourAppealSection: [],
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('yourAppealSection must be a `object` type');
        },
      },
      {
        title: 'rejected - yourAppealSection.appealStatement - empty list',
        given: () => ({
          yourAppealSection: { appealStatement: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'yourAppealSection.appealStatement must be a `object` type'
          );
        },
      },
      {
        title: 'rejected - yourAppealSection.appealStatement - required',
        given: () => ({
          yourAppealSection: { appealStatement: {} },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(4);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'yourAppealSection.appealStatement.hasSensitiveInformation is a required field',
              'yourAppealSection.appealStatement.uploadedFile.name is a required field',
              'yourAppealSection.appealStatement.uploadedFile.originalFileName is a required field',
              'yourAppealSection.appealStatement.uploadedFile.id is a required field',
            ])
          );
        },
      },
      {
        title: 'accepted - yourAppealSection.appealStatement',
        given: () => ({
          yourAppealSection: { appealStatement: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'yourAppealSection.appealStatement must be a `object` type'
          );
        },
      },
      {
        title: 'accepted - yourAppealSection.appealStatement - valid document',
        given: () => ({
          yourAppealSection: {
            appealStatement: {
              hasSensitiveInformation: 'true',
              uploadedFile: {
                name: 'name of the document',
                originalFileName: 'name of the document',
                id: appealId,
              },
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title:
          'rejected - yourAppealSection.appealStatement - file id not uuid format, name missing',
        given: () => ({
          yourAppealSection: {
            appealStatement: {
              hasSensitiveInformation: 'bad format',
              uploadedFile: {
                id: 'this not a good uuid',
                originalFileName: 'a file name',
              },
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(3);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'yourAppealSection.appealStatement.hasSensitiveInformation must be a `boolean` type, but the final value was: `"bad format"`.',
              'yourAppealSection.appealStatement.uploadedFile.id must be a valid UUID',
              'yourAppealSection.appealStatement.uploadedFile.name is a required field',
            ])
          );
        },
      },
      {
        title: 'rejected - yourAppealSection.otherDocuments - empty list',
        given: () => ({
          yourAppealSection: { otherDocuments: [] },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'yourAppealSection.otherDocuments must be a `object` type'
          );
        },
      },
      {
        title: 'accepted - yourAppealSection.otherDocuments - empty object',
        given: () => ({
          yourAppealSection: { otherDocuments: {} },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - yourAppealSection.otherDocuments - uploadedFiles object',
        given: () => ({
          yourAppealSection: { otherDocuments: { uploadedFiles: {} } },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain(
            'yourAppealSection.otherDocuments.uploadedFiles must be a `array` type'
          );
        },
      },
      {
        title: 'accepted - yourAppealSection.otherDocuments - empty uploadedFiles list',
        given: () => ({
          yourAppealSection: { otherDocuments: { uploadedFiles: [] } },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'accepted - yourAppealSection.otherDocuments - good uploadedFiles list',
        given: () => ({
          yourAppealSection: {
            otherDocuments: {
              uploadedFiles: [{ name: 'Good name', originalFileName: 'Good name', id: appealId }],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - yourAppealSection.otherDocuments - bad uploadedFiles list',
        given: () => ({
          yourAppealSection: {
            otherDocuments: {
              uploadedFiles: [
                { name: 'Good name', originalFileName: 'Good name', id: 'bad id' },
                { name: '', originalFileName: '', id: appealId },
              ],
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(2);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'yourAppealSection.otherDocuments.uploadedFiles[0].id must be a valid UUID',
              'yourAppealSection.otherDocuments.uploadedFiles[1].name is a required field',
            ])
          );
        },
      },

      {
        title: 'accepted - appealSiteSection - empty object',
        given: () => ({
          appealSiteSection: {},
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - appealSiteSection - empty list',
        given: () => ({
          appealSiteSection: [],
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(1);
          expect(result.errors[0]).toContain('appealSiteSection must be a `object` type');
        },
      },
      {
        title: 'accepted - appealSiteSection.subsection - empty object',
        given: () => ({
          appealSiteSection: {
            siteAddress: {},
            siteOwnership: {},
            siteAccess: {},
            healthAndSafety: {},
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - appealSiteSection.siteAddress - empty list',
        given: () => ({
          appealSiteSection: {
            siteAddress: [],
            siteOwnership: [],
            siteAccess: [],
            healthAndSafety: [],
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(4);
          expect(result.errors).toEqual(
            expect.arrayContaining([
              'appealSiteSection.siteAddress must be a `object` type, but the final value was: `null` (cast from the value `[]`).\n' +
                ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
              'appealSiteSection.siteOwnership must be a `object` type, but the final value was: `null` (cast from the value `[]`).\n' +
                ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
              'appealSiteSection.siteAccess must be a `object` type, but the final value was: `null` (cast from the value `[]`).\n' +
                ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
              'appealSiteSection.healthAndSafety must be a `object` type, but the final value was: `null` (cast from the value `[]`).\n' +
                ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`',
            ])
          );
        },
      },
      {
        title: 'accepted - appealSiteSection.siteAddress - good values',
        given: () => ({
          appealSiteSection: {
            siteAddress: {
              siteAddress: {},
              siteOwnership: {},
              siteAccess: {},
              healthAndSafety: {},
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      },
      {
        title: 'rejected - appealSiteSection.siteAddress - required',
        given: () => ({
          appealSiteSection: {
            siteAddress: {
              addressLine1: null,
              addressLine2: null,
              town: null,
              county: null,
              postcode: null,
            },
            siteOwnership: {
              ownsWholeSite: null,
              haveOtherOwnersBeenTold: null,
            },
            siteAccess: {
              canInspectorSeeWholeSiteFromPublicRoad: null,
              howIsSiteAccessRestricted: '',
            },
            healthAndSafety: {
              hasIssues: null,
              healthAndSafetyIssues: '',
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(9);
        },
      },
      {
        title: 'rejected - appealSiteSection.subsections - bad values',
        given: () => ({
          appealSiteSection: {
            siteAddress: {
              addressLine1: 'x'.repeat(61),
              addressLine2: 'x'.repeat(61),
              town: 'x'.repeat(61),
              county: 'x'.repeat(61),
              postcode: 'x'.repeat(9),
            },
            siteOwnership: {
              ownsWholeSite: 2,
              haveOtherOwnersBeenTold: 2,
            },
            siteAccess: {
              canInspectorSeeWholeSiteFromPublicRoad: 2,
              howIsSiteAccessRestricted: 'x'.repeat(256),
            },
            healthAndSafety: {
              hasIssues: 2,
              healthAndSafetyIssues: 'x'.repeat(256),
            },
          },
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(11);

          expect(result.errors).toEqual(
            expect.arrayContaining([
              'appealSiteSection.siteAddress.addressLine1 must be at most 60 characters',
              'appealSiteSection.siteAddress.addressLine2 must be at most 60 characters',
              'appealSiteSection.siteAddress.town must be at most 60 characters',
              'appealSiteSection.siteAddress.county must be at most 60 characters',
              'appealSiteSection.siteAddress.postcode must be at most 8 characters',
              'appealSiteSection.siteOwnership.ownsWholeSite must be a `boolean` type, but the final value was: `2`.',
              'appealSiteSection.siteOwnership.haveOtherOwnersBeenTold must be a `boolean` type, but the final value was: `2`.',
              'appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad must be a `boolean` type, but the final value was: `2`.',
              'appealSiteSection.siteAccess.howIsSiteAccessRestricted must be at most 255 characters',
              'appealSiteSection.healthAndSafety.hasIssues must be a `boolean` type, but the final value was: `2`.',
              'appealSiteSection.healthAndSafety.healthAndSafetyIssues must be at most 255 characters',
            ])
          );
        },
      },

      {
        title: 'accepted - sectionStates - empty object',
        given: () => ({
          sectionStates: {},
        }),
        expected: (result) => {
          expect(result.errors.length).toEqual(0);
        },
      }
    );

    tests.forEach(({ title, given, expected }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        req.body = given();
        req.params.id = appealId;
        const result = { appeal, errors: [] };

        await appealUpdateValidationRules(req, res, function next(e) {
          if (e instanceof ApiError) {
            result.errors = e.message.errors;
          }
        });

        if (result.errors.length === 0) {
          result.appeal = req.body;
        }
        expected(result);
      });
    });
  });
});
