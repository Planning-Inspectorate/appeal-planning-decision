const {
  statusSiteOwnership,
} = require('../../../../src/services/task-status/status-site-ownership');

const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const TASK_STATUS = require('../../../../src/services/task-status/task-statuses');

describe('services/task-status/status-site-ownership', () => {
  [
    {
      given: APPEAL_DOCUMENT.empty,
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteOwnership: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteOwnership,
            ownsWholeSite: true,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
    {
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteOwnership: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteOwnership,
            ownsWholeSite: false,
          },
        },
      },
      expected: TASK_STATUS.IN_PROGRESS,
    },
    {
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteOwnership: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteOwnership,
            ownsWholeSite: false,
            haveOtherOwnersBeenTold: true,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
    {
      given: {
        ...APPEAL_DOCUMENT.empty,
        appealSiteSection: {
          ...APPEAL_DOCUMENT.empty.appealSiteSection,
          siteOwnership: {
            ...APPEAL_DOCUMENT.empty.appealSiteSection.siteOwnership,
            ownsWholeSite: false,
            haveOtherOwnersBeenTold: false,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
  ].forEach(({ given, expected }) => {
    it('should return the expected status', () => {
      expect(statusSiteOwnership(given)).toEqual(expected);
    });
  });
});
