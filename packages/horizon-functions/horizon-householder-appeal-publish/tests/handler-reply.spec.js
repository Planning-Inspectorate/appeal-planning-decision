jest.mock('axios');
jest.mock('../src/getHorizonId');
const axios = require('axios');

process.env.GATEWAY_URL = 'openfaas-gateway';

const { convertDocumentArray, populateDocuments, handlerReply } = require('../handler-reply');
const { getMockAppealReply } = require('./mockAppealReply');
const { getHorizonId } = require('../src/getHorizonId');
const sectionTypes = require('../src/sectionTypes');

const getFullExpectation = () => {
  const mockAppealReply = getMockAppealReply();
  const rds = mockAppealReply.requiredDocumentsSection;
  const ods = mockAppealReply.optionalDocumentsSection;

  return [
    {
      id: rds.plansDecision.uploadedFiles[0].id,
      type: sectionTypes.plansDecisionType,
    },
    {
      id: rds.officersReport.uploadedFiles[0].id,
      type: sectionTypes.officersReportType,
    },
    {
      id: ods.interestedPartiesApplication.uploadedFiles[0].id,
      type: sectionTypes.interestedPartiesApplicationType,
    },
    {
      id: ods.representationsInterestedParties.uploadedFiles[0].id,
      type: sectionTypes.representationsInterestedPartiesType,
    },
    {
      id: ods.interestedPartiesAppeal.uploadedFiles[0].id,
      type: sectionTypes.interestedPartiesAppealType,
    },
    {
      id: ods.siteNotices.uploadedFiles[0].id,
      type: sectionTypes.siteNoticesType,
    },
    {
      id: ods.conservationAreaMap.uploadedFiles[0].id,
      type: sectionTypes.conservationAreaMapType,
    },
    {
      id: ods.planningHistory.uploadedFiles[0].id,
      type: sectionTypes.planningHistoryType,
    },
    {
      id: ods.statutoryDevelopment.uploadedFiles[0].id,
      type: sectionTypes.statutoryDevelopmentType,
    },
    {
      id: ods.otherPolicies.uploadedFiles[0].id,
      type: sectionTypes.otherPoliciesType,
    },
    {
      id: ods.supplementaryPlanningDocuments.uploadedFiles[0].id,
      type: sectionTypes.supplementaryPlanningDocumentsType,
    },
  ];
};

describe('addFilesToDocuments', () => {
  it('should return a correctly structured object', async () => {
    const arrayOfFiles = [{ name: 'mock-name-1', id: 'mock-id-1' }];
    const expectation = [{ id: 'mock-id-1', type: 'mock-type' }];
    expect(convertDocumentArray(arrayOfFiles, 'mock-type')).toEqual(expectation);
  });
});

describe('populateDocuments', () => {
  let body;
  let mockAppealReply;
  let expectation;

  beforeEach(() => {
    mockAppealReply = getMockAppealReply();
    body = { ...mockAppealReply };
    expectation = getFullExpectation(mockAppealReply);
  });

  it('should return a correctly structured documents array including all optional documents', async () => {
    expect(populateDocuments(body)).toEqual(expectation);
  });

  it('should return a correctly structured documents array with some optional documents', async () => {
    mockAppealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles = [];
    expectation.pop();
    expect(populateDocuments(body)).toEqual(expectation);
  });
});

describe('handlerReply', () => {
  const envvars = process.env;
  const horizonCaseId = 'mock-horizon-id';
  let context;
  let logMock;
  let newMockAppealReply;
  let body;

  beforeEach(() => {
    process.env = { ...envvars };

    logMock = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    context = {
      httpStatus: 200,
    };

    newMockAppealReply = getMockAppealReply();
    body = { ...newMockAppealReply };
  });

  afterEach(() => {
    process.env = envvars;
    axios.post.mockReset();
  });

  it('should simulate an reply with documents to publish', async () => {
    const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
    getHorizonId.mockReturnValue(horizonCaseId);

    const event = {
      log: logMock,
      body: { ...body },
    };

    expect(await handlerReply(event, context)).toEqual({
      id: horizonFullCaseId.split('/').slice(-1).pop(),
    });

    expect(context).toEqual({
      httpStatus: 200,
    });

    getFullExpectation().forEach(({ id: documentId, type: documentType }) => {
      expect(axios.post).toBeCalledWith(
        '/async-function/horizon-add-document',
        {
          documentId,
          documentType,
          caseReference: horizonCaseId,
          applicationId: body.id,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );
    });
  });
});
