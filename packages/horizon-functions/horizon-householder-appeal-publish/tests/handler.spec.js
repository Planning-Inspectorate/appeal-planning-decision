jest.mock('axios');
jest.mock('../handler-reply');
process.env.APPEALS_SERVICE_URL = 'appeals-api';
process.env.HORIZON_URL = 'horizon-url';
process.env.GATEWAY_URL = 'openfaas-gateway';

const axios = require('axios');
const { advanceTo, clear: clearDateMocks } = require('jest-date-mock');
const { when } = require('jest-when');
const handler = require('../index');
const { handlerReply } = require('../handler-reply');

describe('handler', () => {
  const envvars = process.env;
  let context;
  let logMock;

  beforeEach(() => {
    process.env = { ...envvars };
    advanceTo(new Date(2021, 1, 7, 12, 0, 0));

    logMock = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    context = {
      httpStatus: 200,
    };
  });

  afterEach(() => {
    process.env = envvars;
    clearDateMocks();
    axios.patch.mockReset();
    axios.post.mockReset();
    axios.get.mockReset();
  });

  describe('success', () => {
    it('should simulate a reply being passed to handlerReply', async () => {
      const mockEvent = { body: {} };
      const mockHttpStatus = { httpStatus: 200 };
      handlerReply.mockImplementation();
      await handler(mockEvent, mockHttpStatus);
      expect(handlerReply).toHaveBeenCalled();
    });

    it('should simulate an appeal with original applicant for an English LPA', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );
    });

    it('should simulate an appeal without original applicant for an English LPA', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const agentHorizonContactId = 'some-agent-1';
      const applicantHorizonContactId = 'some-applicant-1';
      const horizonCaseId = '1234780';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const userEmail = 'agent@agent.com';
      const appealId = 'appealId2';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock first Create Contact call
      when(axios.post)
        .calledWith(
          '/function/horizon-create-contact',
          expect.objectContaining({
            email: userEmail,
          }),
          expect.anything()
        )
        .mockResolvedValue({
          data: {
            id: agentHorizonContactId,
          },
        });

      // Mock first Create Contact call
      when(axios.post)
        .calledWith(
          '/function/horizon-create-contact',
          expect.objectContaining({
            email: undefined,
          }),
          expect.anything()
        )
        .mockResolvedValue({
          data: {
            id: applicantHorizonContactId,
          },
        });

      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          _id: appealId,
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: false,
                appealingOnBehalfOf: 'Appellant Name',
                email: userEmail,
                name: 'Agent Name',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [
        agentFirstName,
        ...agentLastName
      ] = event.body.appeal.aboutYouSection.yourDetails.name.split(' ');

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': agentHorizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Agent',
                        },
                      },
                    ],
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': applicantHorizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value':
                            event.body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName: agentFirstName,
          lastName: agentLastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      const [
        appellantFirstName,
        ...appellantLastName
      ] = event.body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ');

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName: appellantFirstName,
          lastName: appellantLastName.join(' '), // Treat multiple spaces as part of last name
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );
    });

    it('should simulate an appeal with original applicant for a Welsh LPA', async () => {
      const lpaCode = 'some-lpa-code2';
      const lpaHorizonId = '12343';
      const horizonContactId = 'some-contact-3';
      const horizonCaseId = '1234566';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'someAppealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: false,
            wales: true,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          _id: appealId,
          appeal: {
            lpaCode,
            decisionDate: '2021-02-01T12:00:00Z',
            requiredDocumentsSection: {
              applicationNumber: 'ABC/124',
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'addy1',
                addressLine2: 'addy2',
                town: 'Sometown2',
                county: 'Somecounty2',
                postcode: 'AB12 3CE',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'john@paulringo.com',
                name: 'John Paul Ringo',
              },
            },
            updatedAt: '2021-01-07T08:15:01Z',
          },
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'Wales',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );
    });

    it('should simulate an appeal without original applicant for a Welsh LPA', async () => {
      const lpaCode = 'some-code';
      const lpaHorizonId = '123d23';
      const agentHorizonContactId = 'some-agent-2';
      const applicantHorizonContactId = 'some-applicant-2';
      const horizonCaseId = '1234565';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'someAppealId2';
      const userEmail = 'agent2@agent2.com';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: false,
            wales: true,
            horizonId: lpaHorizonId,
          },
        });

      // Mock first Create Contact call
      when(axios.post)
        .calledWith(
          '/function/horizon-create-contact',
          expect.objectContaining({
            email: userEmail,
          }),
          expect.anything()
        )
        .mockResolvedValue({
          data: {
            id: agentHorizonContactId,
          },
        });

      // Mock first Create Contact call
      when(axios.post)
        .calledWith(
          '/function/horizon-create-contact',
          expect.objectContaining({
            email: undefined,
          }),
          expect.anything()
        )
        .mockResolvedValue({
          data: {
            id: applicantHorizonContactId,
          },
        });

      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          _id: appealId,
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: false,
                appealingOnBehalfOf: 'Appellant Name',
                email: userEmail,
                name: 'Agent Name',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [
        agentFirstName,
        ...agentLastName
      ] = event.body.appeal.aboutYouSection.yourDetails.name.split(' ');

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'Wales',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': agentHorizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Agent',
                        },
                      },
                    ],
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': applicantHorizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value':
                            event.body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName: agentFirstName,
          lastName: agentLastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      const [
        appellantFirstName,
        ...appellantLastName
      ] = event.body.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ');

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName: appellantFirstName,
          lastName: appellantLastName.join(' '), // Treat multiple spaces as part of last name
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );
    });

    it('should simulate an appeal with documents to publish - no optional docs', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });

    it('should simulate an appeal with documents to publish - include 1 optional docs', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
              otherDocuments: {
                uploadedFiles: [
                  {
                    id: 'optional-file1-id',
                  },
                ],
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[0].id,
          type: 'Appellant Grounds of Appeal',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });

    it('should simulate an appeal with documents to publish - include 2 optional docs', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
              otherDocuments: {
                uploadedFiles: [
                  {
                    id: 'optional-file1-id',
                  },
                  {
                    id: 'optional-file2-id',
                  },
                ],
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[0].id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[1].id,
          type: 'Appellant Grounds of Appeal',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });

    it('should simulate an appeal site fully owned', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
              otherDocuments: {
                uploadedFiles: [
                  {
                    id: 'optional-file1-id',
                  },
                  {
                    id: 'optional-file2-id',
                  },
                ],
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Ownership Certificate',
                    'a:Value': 'Certificate A',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[0].id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[1].id,
          type: 'Appellant Grounds of Appeal',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });

    it('should simulate an appeal site not fully owned', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
              otherDocuments: {
                uploadedFiles: [
                  {
                    id: 'optional-file1-id',
                  },
                  {
                    id: 'optional-file2-id',
                  },
                ],
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: false,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },

                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Ownership Certificate',
                    'a:Value': null,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[0].id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[1].id,
          type: 'Appellant Grounds of Appeal',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });

    it('should simulate an appeal site viewable from road', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
              otherDocuments: {
                uploadedFiles: [
                  {
                    id: 'optional-file1-id',
                  },
                  {
                    id: 'optional-file2-id',
                  },
                ],
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[0].id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[1].id,
          type: 'Appellant Grounds of Appeal',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });

    it('should simulate an appeal site not viewable from road', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            yourAppealSection: {
              appealStatement: {
                uploadedFile: {
                  id: 'appeal-statement-id',
                },
              },
              otherDocuments: {
                uploadedFiles: [
                  {
                    id: 'optional-file1-id',
                  },
                  {
                    id: 'optional-file2-id',
                  },
                ],
              },
            },
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
              originalApplication: {
                uploadedFile: {
                  id: 'original-application-id',
                },
              },
              decisionLetter: {
                uploadedFile: {
                  id: 'decision-letter-id',
                },
              },
            },
            appealSubmission: {
              appealPDFStatement: {
                uploadedFile: {
                  id: 'appeal-pdf-id',
                },
              },
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: false,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        id: horizonFullCaseId.split('/').slice(-1).pop(),
      });

      expect(context).toEqual({
        httpStatus: 200,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );

      [
        {
          id: event.body?.appeal?.yourAppealSection?.appealStatement?.uploadedFile?.id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.originalApplication?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body?.appeal?.requiredDocumentsSection?.decisionLetter?.uploadedFile?.id,
          type: 'LPA Decision Notice',
        },
        {
          id: event.body?.appeal?.appealSubmission?.appealPDFStatement?.uploadedFile?.id,
          type: 'Appellant Initial Documents',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[0].id,
          type: 'Appellant Grounds of Appeal',
        },
        {
          id: event.body.appeal.yourAppealSection.otherDocuments.uploadedFiles[1].id,
          type: 'Appellant Grounds of Appeal',
        },
      ].forEach(({ id: documentId, type: documentType }) => {
        expect(axios.post).toBeCalledWith(
          '/async-function/horizon-add-document',
          {
            documentId,
            documentType,
            caseReference: horizonCaseId,
            applicationId: appealId,
          },
          {
            baseURL: process.env.GATEWAY_URL,
          }
        );
      });
    });
  });

  describe('fail', () => {
    it('should throw an error if the LPA not found', async () => {
      const lpaCode = 'some-bad-lpa-code';

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
          },
        },
      };

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {},
        });

      expect(await handler(event, context)).toEqual({
        message: 'Unknown LPA',
      });

      expect(context).toEqual({
        httpStatus: 500,
      });
    });

    it('should throw an error if the LPA is not Anglo-Welsh', async () => {
      const lpaCode = 'some-bad-lpa-code';

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
          },
        },
      };

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            horizonId: '12',
            england: false,
            wales: false,
          },
        });

      expect(await handler(event, context)).toEqual({
        message: 'LPA neither English nor Welsh',
      });

      expect(context).toEqual({
        httpStatus: 500,
      });
    });

    it('should error if the horizon ID is not set', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {},
        });

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
        },
      };

      expect(await handler(event, context)).toEqual({
        message: 'Horizon ID malformed',
      });

      expect(context).toEqual({
        httpStatus: 500,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });
    });

    it('should error if the update appeal call fails', async () => {
      const lpaCode = 'some-lpa-code';
      const lpaHorizonId = '12345';
      const horizonContactId = 'some-contact-1';
      const horizonCaseId = '1234567';
      const horizonFullCaseId = `ABC/1234/${horizonCaseId}`;
      const appealId = 'appealId1';
      const updateErr = new Error('some error');

      // Mock LPA call
      when(axios.get)
        .calledWith(`/api/v1/local-planning-authorities/${lpaCode}`, expect.anything())
        .mockResolvedValue({
          data: {
            england: true,
            wales: false,
            horizonId: lpaHorizonId,
          },
        });

      // Mock Create Contact call
      when(axios.post)
        .calledWith('/function/horizon-create-contact', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            id: horizonContactId,
          },
        });

      // Mock Horizon call
      when(axios.post)
        .calledWith('/horizon', expect.anything(), expect.anything())
        .mockResolvedValue({
          data: {
            Envelope: {
              Body: {
                CreateCaseResponse: {
                  CreateCaseResult: {
                    value: horizonFullCaseId,
                  },
                },
              },
            },
          },
        });

      axios.patch.mockRejectedValue(updateErr);

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
            decisionDate: '2021-01-01T12:00:00Z',
            requiredDocumentsSection: {
              applicationNumber: 'ABC/123',
            },
            appealSiteSection: {
              siteAddress: {
                addressLine1: 'add1',
                addressLine2: 'add2',
                town: 'Sometown',
                county: 'Somecounty',
                postcode: 'AB12 3CD',
              },
              siteOwnership: {
                ownsWholeSite: true,
              },
              siteAccess: {
                canInspectorSeeWholeSiteFromPublicRoad: true,
              },
            },
            aboutYouSection: {
              yourDetails: {
                isOriginalApplicant: true,
                email: 'bob@smith.com',
                name: 'Bob Smith',
              },
            },
            updatedAt: '2021-02-07T08:15:01Z',
          },
          _id: appealId,
        },
      };

      expect(await handler(event, context)).toEqual({
        message: updateErr.message,
      });

      expect(context).toEqual({
        httpStatus: 500,
      });

      expect(axios.get).toBeCalledWith(`/api/v1/local-planning-authorities/${lpaCode}`, {
        baseURL: process.env.APPEALS_SERVICE_URL,
      });

      const [firstName, ...lastName] = event.body.appeal.aboutYouSection.yourDetails.name.split(
        ' '
      );

      expect(axios.post).toBeCalledWith(
        '/horizon',
        {
          CreateCase: {
            __soap_op: 'http://tempuri.org/IHorizon/CreateCase',
            __xmlns: 'http://tempuri.org/',
            caseType: 'Householder (HAS) Appeal',
            LPACode: lpaHorizonId,
            dateOfReceipt: new Date(),
            location: 'England',
            category: {
              '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business',
              '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
              'a:Attributes': [
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Case Dates:Receipt Date',
                    'a:Value': new Date(event.body.appeal.updatedAt).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Source Indicator',
                    'a:Value': 'Other',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Case Publish Flag',
                    'a:Value': 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:DateAttributeValue',
                    'a:Name': 'Planning Application:Date Of LPA Decision',
                    'a:Value': new Date(event.body.appeal.decisionDate).toISOString(),
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case:Procedure (Appellant)',
                    'a:Value': 'Written Representations',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Planning Application:LPA Application Reference',
                    'a:Value': event.body.appeal.requiredDocumentsSection.applicationNumber,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 1',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine1,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Line 2',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.addressLine2,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Town',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.town,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address County',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.county,
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Address Postcode',
                    'a:Value': event.body.appeal.appealSiteSection.siteAddress.postcode,
                  },
                },
                {
                  'a:AttributeValue': event.body.appeal.appealSiteSection.siteOwnership
                    .ownsWholeSite
                    ? {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        'a:Value': 'Certificate A',
                      }
                    : {
                        '__i:type': 'a:StringAttributeValue',
                        'a:Name': 'Case Site:Ownership Certificate',
                        '__i:nil': 'true',
                      },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Site Viewable From Road',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:StringAttributeValue',
                    'a:Name': 'Case Site:Inspector Need To Enter Site',
                    'a:Value': event.body.appeal.appealSiteSection.siteAccess
                      .canInspectorSeeWholeSiteFromPublicRoad
                      ? 'No'
                      : 'Yes',
                  },
                },
                {
                  'a:AttributeValue': {
                    '__i:type': 'a:SetAttributeValue',
                    'a:Name': 'Case Involvement:Case Involvement',
                    'a:Values': [
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:ContactID',
                          'a:Value': horizonContactId,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Contact Details',
                          'a:Value': event.body.appeal.aboutYouSection.yourDetails.name,
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:DateAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Involvement Start Date',
                          'a:Value': new Date().toISOString(),
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Communication Preference',
                          'a:Value': 'e-mail',
                        },
                      },
                      {
                        'a:AttributeValue': {
                          '__i:type': 'a:StringAttributeValue',
                          'a:Name': 'Case Involvement:Case Involvement:Type Of Involvement',
                          'a:Value': 'Appellant',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          baseURL: process.env.HORIZON_URL,
        }
      );

      expect(axios.post).toBeCalledWith(
        '/function/horizon-create-contact',
        {
          firstName,
          lastName: lastName.join(' '), // Treat multiple spaces as part of last name
          email: event.body.appeal.aboutYouSection.yourDetails.email,
        },
        {
          baseURL: process.env.GATEWAY_URL,
        }
      );

      expect(axios.patch).toBeCalledWith(
        `/api/v1/appeals/${appealId}`,
        {
          horizonId: horizonCaseId,
        },
        {
          baseURL: process.env.APPEALS_SERVICE_URL,
        }
      );
    });

    it('should simulate a failed HTTP call', async () => {
      const lpaCode = 'some-lpa-code';

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
          },
        },
      };

      const message = 'some-message';
      const response = {
        data: 'some-data',
        status: 'some-status',
        headers: 'some-headers',
      };

      axios.get.mockRejectedValue({
        message,
        response,
      });

      expect(await handler(event, context)).toEqual({
        message: 'No response received from Horizon',
      });

      expect(context).toEqual({
        httpStatus: 500,
      });
    });

    it('should simulate a failed Horizon call', async () => {
      const lpaCode = 'some-lpa-code2';

      const event = {
        log: logMock,
        body: {
          appeal: {
            lpaCode,
          },
        },
      };

      const message = 'some-message2';
      const request = 'some-request';

      axios.get.mockRejectedValue({
        message,
        request,
      });

      expect(await handler(event, context)).toEqual({
        message: 'Error sending to Horizon',
      });

      expect(context).toEqual({
        httpStatus: 400,
      });
    });
  });
});
