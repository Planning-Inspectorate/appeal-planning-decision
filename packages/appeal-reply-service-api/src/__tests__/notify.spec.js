const mockError = jest.fn();
const mockInfo = jest.fn();

jest.doMock('../lib/logger', () => ({
  error: mockError,
  info: mockInfo,
}));

jest.mock('axios');
jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
  const mock = {
    setNotifyClient: jest.fn(() => mock),
    setTemplateId: jest.fn(() => mock),
    setTemplateVariable: jest.fn(() => mock),
    setTemplateVariablesFromObject: jest.fn(() => mock),
    addFileToTemplateVariables: jest.fn(() => mock),
    setDestinationEmailAddress: jest.fn(() => mock),
    setEmailReplyToId: jest.fn(() => mock),
    setReference: jest.fn(() => mock),
    sendEmail: jest.fn(() => Promise.resolve('done')),
  };
  return mock;
});

const axios = require('axios');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const { sendAppealReplySubmissionConfirmationEmailToLpa } = require('../lib/notify.js');
const config = require('../lib/config');

describe('Notify', () => {
  let fakeLpaCode;
  let fakeAppealId;
  let fakeFileId;
  let fakeEmail;
  let fakeName;
  let fakeFileData;
  let fakeReplyId;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendAppealReplySubmissionConfirmationEmailToLpa', () => {
    beforeEach(() => {
      fakeLpaCode = '11111';
      fakeAppealId = '000000';
      fakeReplyId = 'xxx-yyy-000';
      fakeFileId = '222222';
      fakeEmail = 'test@test.com';
      fakeName = 'name';
      fakeFileData = 'file data';

      config.services.notify.templates.appealReplySubmissionConfirmation = 'fake-template-id';
      config.services.notify.emailReplyToId.appealReplySubmissionConfirmation =
        'fake-email-reply-to-id';
      config.appeals.url = 'appeals.url';
      config.docs.api.url = 'docs.url';
    });

    describe('unhappy paths', () => {
      test('it returns early if reply.appealId is undefined', async () => {
        await sendAppealReplySubmissionConfirmationEmailToLpa({});
        expect(mockError).toHaveBeenCalledWith('reply.appealId was undefined. Aborting.');
      });

      test('it throws if appeal response is invalid', async () => {
        await sendAppealReplySubmissionConfirmationEmailToLpa({
          appealId: fakeAppealId,
        });
        expect(mockError).toHaveBeenCalledWith(
          { err: new TypeError("Cannot read property 'data' of undefined") },
          'Unable to retrieve appeal data.'
        );
      });

      test('it returns early if appeal.lpaCode is undefined', async () => {
        axios.get.mockResolvedValueOnce('some invalid response');
        await sendAppealReplySubmissionConfirmationEmailToLpa({
          appealId: fakeAppealId,
        });
        expect(mockError).toHaveBeenCalledWith('appeal.lpaCode was undefined. Aborting.');
      });

      test('it throws if LPA response is invalid', async () => {
        axios.get.mockResolvedValueOnce({ data: { lpaCode: fakeLpaCode } });

        await sendAppealReplySubmissionConfirmationEmailToLpa({
          appealId: fakeAppealId,
        });
        expect(mockError).toHaveBeenCalledWith(
          { err: new TypeError("Cannot read property 'data' of undefined") },
          'Unable to retrieve LPA data.'
        );
      });

      test('it throws if PDF response is invalid', async () => {
        axios.get
          .mockResolvedValueOnce({ data: { lpaCode: fakeLpaCode } })
          .mockResolvedValueOnce({ data: { email: fakeEmail } });

        await sendAppealReplySubmissionConfirmationEmailToLpa({
          appealId: fakeAppealId,
        });
        expect(mockError).toHaveBeenCalledWith(
          { err: new TypeError("Cannot read property 'pdfStatement' of undefined") },
          'Unable to retrieve PDF data.'
        );
      });

      test('it throws if lpa.email is invalid', async () => {
        const fakeLpaResponseData = { some: 'data' };
        axios.get
          .mockResolvedValueOnce({ data: { lpaCode: fakeLpaCode } })
          .mockResolvedValueOnce({ data: fakeLpaResponseData })
          .mockResolvedValueOnce({ data: { pdf: fakeFileData } });

        await sendAppealReplySubmissionConfirmationEmailToLpa({
          id: fakeReplyId,
          appealId: fakeAppealId,
          submission: {
            pdfStatement: {
              uploadedFile: {
                id: fakeFileId,
              },
            },
          },
        });
        expect(mockInfo).toHaveBeenCalledWith(
          { docsPath: `${config.docs.api.url}/api/v1/${fakeReplyId}/${fakeFileId}/file` },
          'docs service route'
        );
        expect(mockError).toHaveBeenCalledWith(
          {
            err: new Error('Missing LPA email. This indicates an issue with the look up data.'),
            lpa: fakeLpaResponseData,
          },
          'Unable to send appeal submission received notification email to LPA.'
        );
      });

      test('it throws if unable to send the email', async () => {
        const fakeLpaResponseData = { email: fakeEmail, some: 'data' };
        axios.get
          .mockResolvedValueOnce({ data: { lpaCode: fakeLpaCode } })
          .mockResolvedValueOnce({ data: fakeLpaResponseData })
          .mockResolvedValueOnce({ data: { pdf: fakeFileData } });

        await sendAppealReplySubmissionConfirmationEmailToLpa({
          id: fakeReplyId,
          appealId: fakeAppealId,
          submission: {
            pdfStatement: {
              uploadedFile: {
                id: fakeFileId,
              },
            },
          },
        });
        expect(mockInfo).toHaveBeenCalledWith(
          { docsPath: `${config.docs.api.url}/api/v1/${fakeReplyId}/${fakeFileId}/file` },
          'docs service route'
        );
        expect(mockError).toHaveBeenCalledWith(
          {
            err: new TypeError("Cannot read property 'applicationNumber' of undefined"),
            lpa: fakeLpaResponseData,
          },
          'Unable to send appeal submission received notification email to LPA.'
        );
      });
    });

    describe('happy path', () => {
      test('Send Appeal Reply Submission Confirmation Email To Lpa', async () => {
        axios.get
          .mockResolvedValueOnce({
            data: {
              id: fakeAppealId,
              lpaCode: fakeLpaCode,
              requiredDocumentsSection: {
                applicationNumber: fakeAppealId,
              },
            },
          })
          .mockResolvedValueOnce({
            data: {
              name: fakeName,
              email: fakeEmail,
            },
          })
          .mockResolvedValueOnce({
            data: fakeFileData,
          });

        const reply = {
          lpaCode: fakeLpaCode,
          appealId: fakeAppealId,
          submission: {
            pdfStatement: {
              uploadedFile: {
                id: fakeFileId,
              },
            },
          },
          id: fakeReplyId,
        };

        await sendAppealReplySubmissionConfirmationEmailToLpa(reply);

        expect(mockError).not.toHaveBeenCalled();

        expect(axios.get).toHaveBeenCalledWith('appeals.url/api/v1/appeals/000000');
        expect(axios.get).toHaveBeenCalledWith(
          'appeals.url/api/v1/local-planning-authorities/11111'
        );
        expect(axios.get).toHaveBeenCalledWith('docs.url/api/v1/xxx-yyy-000/222222/file', {
          responseType: 'arraybuffer',
        });

        expect(NotifyBuilder.setTemplateId).toHaveBeenCalledWith(
          config.services.notify.templates.appealReplySubmissionConfirmation
        );
        expect(NotifyBuilder.setEmailReplyToId).toHaveBeenCalledWith(
          config.services.notify.emailReplyToId.appealReplySubmissionConfirmation
        );
        expect(NotifyBuilder.setDestinationEmailAddress).toHaveBeenCalledWith(fakeEmail);
        expect(NotifyBuilder.setTemplateVariablesFromObject).toHaveBeenCalledWith({
          'Name of local planning department': fakeName,
          'Planning appeal number': fakeAppealId,
          'Planning application number': fakeAppealId,
        });
        expect(NotifyBuilder.setReference).toHaveBeenCalledWith(
          `${fakeAppealId}.SubmissionConfirmation`
        );
        expect(NotifyBuilder.addFileToTemplateVariables).toHaveBeenCalledWith(
          'link to appeal questionnaire pdf',
          fakeFileData
        );
        expect(NotifyBuilder.sendEmail).toHaveBeenCalled();
      });
    });
  });
});
