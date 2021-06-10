const {
  statusAppealSiteAddress,
} = require('../../../../src/services/task-status/status-appeal-site-address');

const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const TASK_STATUS = require('../../../../src/services/task-status/task-statuses');

describe('services/task-status/status-appeal-site-address', () => {
  [
    {
      description: 'Not started by default',
      given: APPEAL_DOCUMENT.empty,
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Requires postcode',
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteAddress: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteAddress,
            addressLine1: 'fake line 1',
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Requires addressLine1',
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteAddress: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteAddress,
            postcode: 'fake postcode',
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Empty strings are not valid',
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteAddress: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteAddress,
            addressLine1: '',
            postcode: '',
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Happy path',
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteAddress: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteAddress,
            addressLine1: 'fake line 1',
            postcode: 'fake postcode',
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
  ].forEach(({ description, given, expected }) => {
    it(`should return the expected status - ${expected} - ${description}`, () => {
      expect(statusAppealSiteAddress(given)).toEqual(expected);
    });
  });
});
