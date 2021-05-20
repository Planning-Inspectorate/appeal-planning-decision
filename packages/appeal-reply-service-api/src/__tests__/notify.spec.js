const axios = require('axios');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const notify = require('../lib/notify.js');

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
    const lpaCode = '000000';
    const appealId = '000000';
    axios.get.mockResolvedValue({
      data: {
        id: lpaCode,
        name: 'name',
        email: 'test@test.com',
        lpacode: lpaCode,
        requiredDocumentsSection: {
          applicationNumber: '000000',
        },
      },
    });

    await notify.sendAppealReplySubmissionConfirmationEmailToLpa({
      lpacode: lpaCode,
      appealId,
      submission: {
        pdfStatement: {
          uploadedFile: {
            id: '0000000',
          },
        },
      },
    });

    expect(axios.get).toHaveBeenCalled();
    expect(NotifyBuilder.setTemplateId).toHaveBeenCalled();
    expect(NotifyBuilder.setDestinationEmailAddress).toHaveBeenCalled();
    expect(NotifyBuilder.setTemplateVariablesFromObject).toHaveBeenCalled();
    expect(NotifyBuilder.setReference).toHaveBeenCalled();
    expect(NotifyBuilder.addFileToTemplateVariables).toHaveBeenCalled();
    expect(NotifyBuilder.sendEmail).toHaveBeenCalled();
  });
});
