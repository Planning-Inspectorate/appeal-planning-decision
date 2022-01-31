jest.mock('../../../../src/lib/notify-validation');
jest.mock('../../../../src/services/lpa.service');

const config = require('../../../../src/lib/config');

const { APPEAL_DOCUMENT } = require('../../../data/empty-appeal');
const {
  isValidAppealForSubmissionReceivedNotificationEmail,
} = require('../../../../src/lib/notify-validation');

const mockError = jest.fn();

jest.doMock('../../../../src/lib/logger', () => ({
  error: mockError,
}));

const mockReset = jest.fn().mockReturnThis();
const mockSetTemplateId = jest.fn().mockReturnThis();
const mockSetDestinationEmailAddress = jest.fn().mockReturnThis();
const mockSetEmailReplyToId = jest.fn().mockReturnThis();
const mockSetTemplateVariablesFromObject = jest.fn().mockReturnThis();
const mockSetReference = jest.fn().mockReturnThis();
const mockSend = jest.fn();

jest.doMock('@pins/common/src/lib/notify/notify-builder', () => ({
  reset: mockReset,
  setTemplateId: mockSetTemplateId,
  setDestinationEmailAddress: mockSetDestinationEmailAddress,
  setEmailReplyToId: mockSetEmailReplyToId,
  setTemplateVariablesFromObject: mockSetTemplateVariablesFromObject,
  setReference: mockSetReference,
  sendEmail: mockSend,
}));

const { getLpa } = require('../../../../src/services/lpa.service');

const {
  sendAppealSubmissionReceivedNotificationEmailToLpa,
  sendAppealSubmissionConfirmationEmailToAppellant,
} = require('../../../../src/lib/full-appeal/notify');
const { APPEAL_TYPE } = require('../../../../src/constants');

describe('lib/full-appeal/notify', () => {
  describe('sendAppealSubmissionReceivedNotificationEmailToLpa', () => {
    let notifyBuilder;

    beforeEach(() => {
      jest.doMock('../../../../../common/src/lib/notify/notify-builder', () => notifyBuilder);

      isValidAppealForSubmissionReceivedNotificationEmail.mockReturnValue(true);
    });

    it('should throw an error if appeal is invalid', async () => {
      isValidAppealForSubmissionReceivedNotificationEmail.mockReturnValue(false);
      try {
        await sendAppealSubmissionReceivedNotificationEmailToLpa({});
      } catch (e) {
        expect(e).toEqual(new Error('Appeal was not available.'));
      }
    });

    describe('with valid appeal object', () => {
      let appeal;

      beforeEach(() => {
        appeal = {
          ...APPEAL_DOCUMENT.empty,
          appealType: APPEAL_TYPE.PLANNING_SECTION_78,
          id: 'some-fake-id',
          lpaCode: 'some-lpa-code',
          submissionDate: new Date('19 April 2021'),
          requiredDocumentsSection: {
            ...APPEAL_DOCUMENT.empty.requiredDocumentsSection,
            applicationNumber: '123/abc/xyz',
          },
          appealSiteSection: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection,
            siteAddress: {
              addressLine1: '999 some street',
              town: 'a town',
              postcode: 'rt12 9ya',
            },
          },
          eligibility: {
            applicationDecision: 'refused',
          },
        };
      });

      afterEach(() => {
        mockError.mockClear();
        mockSend.mockClear();
      });

      it('should log an error if unable to find the given LPA by ID', async () => {
        const error = new Error('boom');
        getLpa.mockRejectedValue(error);

        try {
          await sendAppealSubmissionReceivedNotificationEmailToLpa(appeal);
        } catch (e) {
          expect(mockError).toHaveBeenCalledWith(
            { err: e, lpaCode: 'some-lpa-code' },
            'Unable to find LPA from given lpaCode'
          );
        }
      });

      it('should throw if the looked up LPA has no email address', async () => {
        const mockLpa = { name: 'whoops, email is missing' };
        getLpa.mockResolvedValue(mockLpa);

        await sendAppealSubmissionReceivedNotificationEmailToLpa(appeal);

        try {
          await sendAppealSubmissionReceivedNotificationEmailToLpa(appeal);
        } catch (e) {
          expect(mockError).toHaveBeenCalledWith(
            {
              err: new Error('Missing LPA email. This indicates an issue with the look up data.'),
              lpa: mockLpa,
            },
            'Unable to send appeal submission received notification email to LPA.'
          );
        }
      });

      it('should send an email', async () => {
        getLpa.mockResolvedValue({ name: 'a happy value', email: 'some@example.com' });

        await sendAppealSubmissionReceivedNotificationEmailToLpa(appeal);

        expect(mockError).not.toHaveBeenCalled();

        expect(mockReset).toHaveBeenCalled();
        expect(mockSetTemplateId).toHaveBeenCalledWith(
          config.services.notify.templates.fullAppeal.appealNotificationEmailToLpa
        );
        expect(mockSetDestinationEmailAddress).toHaveBeenCalledWith('some@example.com');
        expect(mockSetTemplateVariablesFromObject).toHaveBeenCalledWith({
          'loca planning department': 'a happy value',
          'planning application number': '123/abc/xyz',
          'site address': '999 some street\na town\nrt12 9ya',
          refused: 'yes',
          granted: 'no',
          'non-determination': 'no',
          'submission date': '19 April 2021',
        });
        expect(mockSetReference).toHaveBeenCalledWith('some-fake-id');
        expect(mockSend).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('sendAppealSubmissionConfirmationEmailToAppellant', () => {
    let notifyBuilder;

    beforeEach(() => {
      jest.doMock('../../../../../common/src/lib/notify/notify-builder', () => notifyBuilder);

      isValidAppealForSubmissionReceivedNotificationEmail.mockReturnValue(true);
    });

    it('should throw an error if appeal is invalid', async () => {
      isValidAppealForSubmissionReceivedNotificationEmail.mockReturnValue(false);
      try {
        await sendAppealSubmissionConfirmationEmailToAppellant({});
      } catch (e) {
        expect(e).toEqual(new Error('Appeal was not available.'));
      }
    });

    describe('with valid appeal object', () => {
      let appeal;

      beforeEach(() => {
        appeal = {
          ...APPEAL_DOCUMENT.empty,
          appealType: APPEAL_TYPE.PLANNING_SECTION_78,
          id: 'some-fake-id',
          lpaCode: 'some-lpa-code',
          submissionDate: new Date('19 April 2021'),
          aboutYouSection: {
            yourDetails: {
              name: 'appellant name',
              email: 'test@gmail.com',
            },
          },
          requiredDocumentsSection: {
            ...APPEAL_DOCUMENT.empty.requiredDocumentsSection,
            applicationNumber: '123/abc/xyz',
          },
          appealSiteSection: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection,
            siteAddress: {
              addressLine1: '999 some street',
              town: 'a town',
              postcode: 'rt12 9ya',
            },
          },
          appealSubmission: {
            appealPDFStatement: {
              uploadedFile: {
                id: 'file-id',
              },
            },
          },
        };
      });

      afterEach(() => {
        mockError.mockClear();
        mockSend.mockClear();
      });

      it('should log an error if unable to find the given LPA by ID', async () => {
        const error = new Error('boom');
        getLpa.mockRejectedValue(error);

        try {
          await sendAppealSubmissionConfirmationEmailToAppellant(appeal);
        } catch (e) {
          expect(mockError).toHaveBeenCalledWith(
            { err: e, lpaCode: 'some-lpa-code' },
            'Unable to find LPA from given lpaCode'
          );
        }
      });

      it('should throw if the looked up LPA has no email address', async () => {
        const mockLpa = { name: 'whoops, email is missing' };
        getLpa.mockResolvedValue(mockLpa);

        try {
          await sendAppealSubmissionConfirmationEmailToAppellant(appeal);
        } catch (e) {
          expect(mockError).toHaveBeenCalledWith(
            {
              err: new Error('Missing LPA email. This indicates an issue with the look up data.'),
              lpa: mockLpa,
            },
            'Unable to send appeal submission received notification email to LPA.'
          );
        }
      });

      it('should send an email', async () => {
        getLpa.mockResolvedValue({ name: 'lpa name', email: 'some@example.com' });

        const fullAppeal = {
          ...appeal,
          contactDetailsSection: {
            name: 'appellant name',
            email: 'test@gmail.com',
          },
        };

        await sendAppealSubmissionConfirmationEmailToAppellant(fullAppeal);

        expect(mockError).not.toHaveBeenCalled();

        expect(mockReset).toHaveBeenCalled();
        expect(mockSetTemplateId).toHaveBeenCalledWith(
          config.services.notify.templates.fullAppeal.appealNotificationEmailToLpa
        );
        expect(mockSetDestinationEmailAddress).toHaveBeenCalledWith('test@gmail.com');
        expect(mockSetTemplateVariablesFromObject).toHaveBeenCalledWith({
          name: 'appellant name',
          'appeal site address': '999 some street\na town\nrt12 9ya',
          'local planning department': 'lpa name',
          'link to pdf': `${config.apps.appeals.baseUrl}/document/some-fake-id/file-id`,
        });
        expect(mockSetReference).toHaveBeenCalledWith('some-fake-id');
        expect(mockSend).toHaveBeenCalledTimes(1);
      });
    });
  });
});
