jest.mock('../../../src/lib/notify-validation');
jest.mock('../../../src/services/lpa.service');

const config = require('../../../src/lib/config');

const { APPEAL_DOCUMENT } = require('../../../src/lib/empty-appeal');
const {
  isValidAppealForSubmissionReceivedNotificationEmail,
  isValidAppealForSendStartEmailToLPAEmail,
} = require('../../../src/lib/notify-validation');

const mockError = jest.fn();

jest.doMock('../../../src/lib/logger', () => ({
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

const { getLpa } = require('../../../src/services/lpa.service');

const {
  getNotifyClientArguments,
  getFileUrl,
  getOptions,
  sendAppealSubmissionReceivedNotificationEmailToLpa,
  sendAppealSubmissionConfirmationEmailToAppellant,
  sendStartEmailToLPA,
} = require('../../../src/lib/notify');

describe('lib/notify', () => {
  describe('getNotifyClientArguments', () => {
    test('Using mock service', () => {
      const baseUrl = 'http://mock-notify:3000';
      const serviceId = 'dummy-service-id-for-notify';
      const apiKey = 'dummy-api-key-for-notify';
      const output = [
        'http://mock-notify:3000',
        'dummy-service-id-for-notify',
        'dummy-api-key-for-notify',
      ];
      expect(getNotifyClientArguments(baseUrl, serviceId, apiKey)).toEqual(output);
    });

    test('Using real service', () => {
      const baseUrl = null;
      const serviceId = 'dummy-service-id-for-notify';
      const apiKey = 'dummy-api-key-for-notify';
      const output = ['dummy-api-key-for-notify'];
      expect(getNotifyClientArguments(baseUrl, serviceId, apiKey)).toEqual(output);
    });
  });

  describe('getFileUrl', () => {
    test('Calculate file url', () => {
      const docSrvUrl = 'http:/docs-srv:3000';
      const applicationId = 'fdre-355g-jd7798';
      const documentId = 'jh345-kjesw-23c-kdfgu';
      const output = 'http:/docs-srv:3000/api/v1/fdre-355g-jd7798/jh345-kjesw-23c-kdfgu/file';
      expect(getFileUrl(docSrvUrl, applicationId, documentId)).toEqual(output);
    });
  });

  describe('getOptions', () => {
    test('Calculate options', () => {
      const address = 'Line 1\nLine 2\nTown\nCounty\nSA18 3RT';
      const link = {
        file: 'JVBERi0MxNTIxUXXhTu/X5Nzc0CiUlRU9G',
        is_csv: false,
      };
      const lpa = 'System Test Borough Council';
      const name = 'John Smith';
      const appealId = 'jhbdfoi-d72344675348-q3iuhak7u5324jvb§00mdf-jdaijhbwefi';
      const output = {
        personalisation: {
          'appeal site address': address,
          'link to appeal submission pdf': link,
          'local planning department': lpa,
          name,
        },
        reference: appealId,
      };
      expect(getOptions(address, link, lpa, name, appealId)).toEqual(output);
    });
  });

  /**
   * This was left untested :/
   * @see https://github.com/Planning-Inspectorate/appeal-planning-decision/pull/746
   */
  describe.skip('sendEmail', () => {
    it('should send an email', () => {});
  });

  describe('sendAppealSubmissionReceivedNotificationEmailToLpa', () => {
    let notifyBuilder;

    beforeEach(() => {
      jest.doMock('../../../../common/src/lib/notify/notify-builder', () => notifyBuilder);

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
          config.services.notify.templates.appealNotificationEmailToLpa
        );
        expect(mockSetDestinationEmailAddress).toHaveBeenCalledWith('some@example.com');
        expect(mockSetTemplateVariablesFromObject).toHaveBeenCalledWith({
          LPA: 'a happy value',
          date: '19 April 2021',
          'planning application number': '123/abc/xyz',
          'site address': '999 some street\na town\nrt12 9ya',
        });
        expect(mockSetReference).toHaveBeenCalledWith('some-fake-id');
        expect(mockSend).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('sendAppealSubmissionConfirmationEmailToAppellant', () => {
    let notifyBuilder;

    beforeEach(() => {
      jest.doMock('../../../../common/src/lib/notify/notify-builder', () => notifyBuilder);

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
          id: 'some-fake-id',
          lpaCode: 'some-lpa-code',
          submissionDate: new Date('19 April 2021'),
          aboutYouSection: {
            yourDetails: {
              name: 'appellant name',
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

        await sendAppealSubmissionConfirmationEmailToAppellant(appeal);

        expect(mockError).not.toHaveBeenCalled();

        expect(mockReset).toHaveBeenCalled();
        expect(mockSetTemplateId).toHaveBeenCalledWith(
          config.services.notify.templates.appealNotificationEmailToApellant
        );
        expect(mockSetDestinationEmailAddress).toHaveBeenCalledWith('some@example.com');
        expect(mockSetTemplateVariablesFromObject).toHaveBeenCalledWith({
          name: 'appellant name',
          'appeal site address': '999 some street\na town\nrt12 9ya',
          'local planning department': 'lpa name',
          'view appeal url': `${config.apps.appeals.baseUrl}/your-planning-appeal/some-fake-id`,
        });
        expect(mockSetReference).toHaveBeenCalledWith('some-fake-id');
        expect(mockSend).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('sendStartEmailToLPA', () => {
    let notifyBuilder;

    beforeEach(() => {
      jest.doMock('../../../../common/src/lib/notify/notify-builder', () => notifyBuilder);

      isValidAppealForSendStartEmailToLPAEmail.mockReturnValue(true);
    });

    it('should throw an error if appeal is invalid', async () => {
      isValidAppealForSendStartEmailToLPAEmail.mockReturnValue(false);
      try {
        await sendStartEmailToLPA({});
      } catch (e) {
        expect(e).toEqual(new Error('Appeal was not available.'));
      }
    });

    describe('with valid appeal object', () => {
      let appeal;

      beforeEach(() => {
        appeal = {
          ...APPEAL_DOCUMENT.empty,
          id: 'some-fake-id',
          lpaCode: 'some-lpa-code',
          horizonId: 'some-fake-horizon-id',
          submissionDate: new Date('19 April 2021'),
          aboutYouSection: {
            yourDetails: {
              name: 'appellant name',
              email: 'timmy@tester.com',
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
          await sendStartEmailToLPA(appeal);
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
          await sendStartEmailToLPA(appeal);
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

        await sendStartEmailToLPA(appeal);

        expect(mockError).not.toHaveBeenCalled();

        expect(mockReset).toHaveBeenCalled();
        expect(mockSetEmailReplyToId).toHaveBeenCalledWith(
          config.services.notify.emailReplyToId.startEmailToLpa
        );
        expect(mockSetTemplateId).toHaveBeenCalledWith(
          config.services.notify.templates.startEmailToLpa
        );
        expect(mockSetDestinationEmailAddress).toHaveBeenCalledWith('some@example.com');
        expect(mockSetTemplateVariablesFromObject).toHaveBeenCalledWith({
          'site address one line': '999 some street, a town, rt12 9ya',
          'horizon id': appeal.horizonId,
          lpa: 'a happy value',
          'planning application number': appeal.requiredDocumentsSection.applicationNumber,
          'site address': '999 some street\na town\nrt12 9ya',
          'questionnaire due date': '24 April 2021',
          url: 'http://fake-lpa-questionnaire-base-url/some-fake-id',
          'appellant email address': appeal.aboutYouSection.yourDetails.email,
        });
        expect(mockSetReference).toHaveBeenCalledWith('some-fake-id');
        expect(mockSend).toHaveBeenCalledTimes(1);
      });
    });
  });
});
