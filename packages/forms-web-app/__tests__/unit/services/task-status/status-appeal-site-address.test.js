const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
  statusAppealSiteAddress,
} = require('../../../../src/services/task-status/status-appeal-site-address');
const TASK_STATUS = require('../../../../src/services/task-status/task-statuses');

appeal.appealSiteSection.siteAddress.addressLine1 = null;
appeal.appealSiteSection.siteAddress.postcode = null;

describe('services/task-status/status-appeal-site-address', () => {
  [
    {
      description: 'Not started by default',
      given: appeal,
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Requires postcode',
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteAddress: {
            ...appeal.appealSiteSection.siteAddress,
            addressLine1: 'fake line 1',
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Requires addressLine1',
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteAddress: {
            ...appeal.appealSiteSection.siteAddress,
            postcode: 'fake postcode',
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'Empty strings are not valid',
      given: {
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteAddress: {
            ...appeal.appealSiteSection.siteAddress,
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
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          siteAddress: {
            ...appeal.appealSiteSection.siteAddress,
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
