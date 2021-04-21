const {
  isValidAppealForSubmissionReceivedNotificationEmail,
} = require('../../../src/lib/notify-validation');

describe('lib/notify-validation', () => {
  describe('isValidAppealForSubmissionReceivedNotificationEmail', () => {
    [
      { appeal: undefined },
      { appeal: null },
      { appeal: {} },
      { appeal: { id: 'some-uuid' } },
      { appeal: { id: 'some-uuid', lpaCode: '123' } },
      { appeal: { id: 'some-uuid', lpaCode: '123', submissionDate: new Date() } },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: undefined,
        },
      },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: {},
        },
      },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: {
            applicationNumber: undefined,
          },
        },
      },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: { applicationNumber: '123/abc' },
          appealSiteSection: undefined,
        },
      },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: { applicationNumber: '123/abc' },
          appealSiteSection: {},
        },
      },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: { applicationNumber: '123/abc' },
          appealSiteSection: { siteAddress: undefined },
        },
      },
    ].forEach(({ appeal }) => {
      it('should return false appeal is invalid', async () => {
        expect(isValidAppealForSubmissionReceivedNotificationEmail(appeal)).toBeFalsy();
      });
    });

    [
      // empty strings are valid, see JIRA AS-1854
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '',
          submissionDate: new Date(),
          requiredDocumentsSection: { applicationNumber: '' },
          appealSiteSection: { siteAddress: { addressLine1: '' } },
        },
      },
      {
        appeal: {
          id: 'some-uuid',
          lpaCode: '123',
          submissionDate: new Date(),
          requiredDocumentsSection: { applicationNumber: '123/abc' },
          appealSiteSection: { siteAddress: { addressLine1: '123 fake street' } },
        },
      },
    ].forEach(({ appeal }) => {
      it('should return true appeal is valid', async () => {
        expect(isValidAppealForSubmissionReceivedNotificationEmail(appeal)).toBeTruthy();
      });
    });
  });
});
