const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
  statusSiteOwnership,
} = require('../../../../src/services/task-status/status-site-ownership');
const TASK_STATUS = require('../../../../src/services/task-status/task-statuses');

describe('services/task-status/status-site-ownership', () => {
  [
    {
      given: {
        ...appeal,
        appealSiteSection: {
          siteOwnership: {
            ownsWholeSite: null,
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteOwnership: {
            ...appeal.appealSiteSection.siteOwnership,
            ownsWholeSite: true,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
    {
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteOwnership: {
            ...appeal.appealSiteSection.siteOwnership,
            ownsWholeSite: false,
            haveOtherOwnersBeenTold: null,
          },
        },
      },
      expected: TASK_STATUS.IN_PROGRESS,
    },
    {
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteOwnership: {
            ...appeal.appealSiteSection.siteOwnership,
            ownsWholeSite: false,
            haveOtherOwnersBeenTold: true,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
    {
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteOwnership: {
            ...appeal.appealSiteSection.siteOwnership,
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
