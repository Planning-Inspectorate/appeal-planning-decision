const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const {
  sendSubmissionReceivedEmailToLpa,
  sendSubmissionConfirmationEmailToAppellant,
} = require('../../../src/lib/notify');
const logger = require('../../../src/lib/logger');

jest.mock('@pins/common/src/lib/notify/notify-builder', () => ({
  reset: jest.fn().mockReturnThis(),
  setTemplateId: jest.fn().mockReturnThis(),
  setDestinationEmailAddress: jest.fn().mockReturnThis(),
  setTemplateVariablesFromObject: jest.fn().mockReturnThis(),
  setReference: jest.fn().mockReturnThis(),
  sendEmail: jest.fn().mockReturnThis(),
}));
jest.mock('../../../src/services/lpa.service', () => ({
  getLpa: jest
    .fn()
    .mockImplementationOnce(() => ({
      email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
      name: 'System Test Borough Council',
    }))
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    })
    .mockImplementationOnce(() => ({
      email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
      name: 'System Test Borough Council',
    }))
    .mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    }),
}));
jest.mock('../../../src/lib/config', () => ({
  services: {
    notify: {
      templates: {
        1001: {
          appealSubmissionConfirmationEmailToAppellant: 'appellant-template',
          appealNotificationEmailToLpa: 'lpa-template',
        },
      },
    },
  },
  logger: {
    level: 'info',
  },
}));
jest.mock('../../../src/lib/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('lib/notify', () => {
  process.env.APP_APPEALS_BASE_URL = 'http://localhost';

  describe('sendSubmissionConfirmationEmailToAppellant', () => {
    it('todo tests for new implementation', async () => {
      await sendSubmissionConfirmationEmailToAppellant(householderAppeal);

      expect(1).toEqual(1);
    });
  });

  describe('sendSubmissionReceivedEmailToLpa', () => {
    it('todo tests for new implementation', async () => {
      await sendSubmissionReceivedEmailToLpa(householderAppeal);

      expect(1).toEqual(1);
    });
  });
});
