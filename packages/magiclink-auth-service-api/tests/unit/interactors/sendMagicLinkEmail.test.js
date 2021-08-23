// eslint-disable-next-line no-unused-vars
const notifyBuilderMock = jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
  const mock = {
    reset: jest.fn(() => mock),
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

jest.mock('../../../src/util/logger');

const mockNotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const mockLogger = require('../../../src/util/logger');
const sendMagicLinkEmail = require('../../../src/interactors/sendMagicLinkEmail');

describe('interactors.sendMagicLinkEmail', () => {
  describe('with notify service up and running', () => {
    it('should send email using the notify builder', async () => {
      await sendMagicLinkEmail('mock.email@test.com', 'https://localhost:9003/magiclink/mockJWT');

      expect(mockNotifyBuilder.setTemplateId).toHaveBeenCalledWith('mockTemplateId');
      expect(mockNotifyBuilder.setTemplateVariablesFromObject).toHaveBeenCalledWith({
        magicLinkURL: 'https://localhost:9003/magiclink/mockJWT',
      });
      expect(mockNotifyBuilder.setDestinationEmailAddress).toHaveBeenCalledWith(
        'mock.email@test.com',
      );
      expect(mockNotifyBuilder.sendEmail).toHaveBeenCalled();
    });
  });

  describe('with notify service down', () => {
    it('should catch and log error', async () => {
      mockNotifyBuilder.sendEmail.mockRejectedValue(new Error('Service down'));

      await sendMagicLinkEmail('mock.email@test.com', 'https://localhost:9003/magiclink/mockJWT');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
