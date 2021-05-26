const axios = require('axios');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const notify = require('../lib/notify.js');
const config = require('../lib/config');

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

describe('Notify', () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  test('Send Appeal Reply Submission Confirmation Email To Lpa', async () => {
    const lpaCode = '11111';
    const appealId = '000000';
    const fileId = '222222';
    const email = 'test@test.com';
    const name = 'name';
    const fileData = 'file data';

    config.services.notify.templates.appealReplySubmissionConfirmation = 'test';
    config.appeals.url = 'appeals.url';
    config.docs.api.url = 'docs.url';

    axios.get
      .mockResolvedValueOnce({
        data: {
          id: appealId,
          requiredDocumentsSection: {
            applicationNumber: appealId,
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          name,
          email,
        },
      })
      .mockResolvedValueOnce({
        data: fileData,
      });

    await notify.sendAppealReplySubmissionConfirmationEmailToLpa({
      lpaCode,
      appealId,
      submission: {
        pdfStatement: {
          uploadedFile: {
            id: fileId,
          },
        },
      },
      id: appealId,
    });

    expect(NotifyBuilder.setTemplateId).toHaveBeenCalledWith(
      config.services.notify.templates.appealReplySubmissionConfirmation
    );
    expect(NotifyBuilder.setDestinationEmailAddress).toHaveBeenCalledWith(email);
    expect(NotifyBuilder.setTemplateVariablesFromObject).toHaveBeenCalledWith({
      'name of local planning department': name,
      'planning appeal reference': appealId,
      'planning application number': appealId,
    });
    expect(NotifyBuilder.setReference).toHaveBeenCalledWith(`${appealId}.SubmissionConfirmation`);
    expect(NotifyBuilder.addFileToTemplateVariables).toHaveBeenCalledWith(
      'link to appeal submission pdf',
      fileData
    );
    expect(NotifyBuilder.sendEmail).toHaveBeenCalled();
  });
});
