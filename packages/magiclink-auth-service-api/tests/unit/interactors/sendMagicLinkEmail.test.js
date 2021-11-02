jest.mock('@pins/common/src/lib/notify/notify-builder', () => {
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

const notifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const logger = require('../../../src/util/logger');
const sendMagicLinkEmail = require('../../../src/interactors/sendMagicLinkEmail');

describe('interactors.sendMagicLinkEmail', () => {
  describe('with notify service up and running', () => {
    it('should send email using the notify builder', async () => {
      await sendMagicLinkEmail('mock.email@test.com', 'https://localhost:9003/magiclink/mockJWT');

      expect(notifyBuilder.setTemplateId).toHaveBeenCalledWith('mockTemplateId');
      expect(notifyBuilder.setTemplateVariablesFromObject).toHaveBeenCalledWith({
        magicLinkURL: 'https://localhost:9003/magiclink/mockJWT',
      });
      expect(notifyBuilder.setDestinationEmailAddress).toHaveBeenCalledWith('mock.email@test.com');
      expect(notifyBuilder.sendEmail).toHaveBeenCalled();
    });
  });

  describe('with notify service down', () => {
    it('should catch and log error', async () => {
      notifyBuilder.sendEmail.mockRejectedValue(new Error('Service down'));

      await sendMagicLinkEmail('mock.email@test.com', 'https://localhost:9003/magiclink/mockJWT');

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
