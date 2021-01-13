const { statusYourDetails } = require('../../../../src/services/task-status/status-your-details');
const TASK_STATUS = require('../../../../src/services/task-status/task-statuses');

describe('services/task-status/status-your-details', () => {
  [
    {
      description: 'isOriginalApplicant !== null',
      given: {
        aboutYouSection: {
          yourDetails: {
            isOriginalApplicant: null,
          },
        },
      },
      expected: TASK_STATUS.NOT_STARTED,
    },
    {
      description: 'isOriginalApplicant, but no name',
      given: {
        aboutYouSection: {
          yourDetails: {
            isOriginalApplicant: true,
            name: null,
            email: null,
            appealingOnBehalfOf: null,
          },
        },
      },
      expected: TASK_STATUS.IN_PROGRESS,
    },
    {
      description: 'appealingOnBehalfOf, but no name',
      given: {
        aboutYouSection: {
          yourDetails: {
            isOriginalApplicant: null,
            name: null,
            email: null,
            appealingOnBehalfOf: true,
          },
        },
      },
      expected: TASK_STATUS.IN_PROGRESS,
    },
    {
      description: 'isOriginalApplicant with name',
      given: {
        aboutYouSection: {
          yourDetails: {
            isOriginalApplicant: true,
            name: 'jim',
            email: null,
            appealingOnBehalfOf: null,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
    {
      description: 'appealingOnBehalfOf with name',
      given: {
        aboutYouSection: {
          yourDetails: {
            isOriginalApplicant: null,
            name: 'jim',
            email: null,
            appealingOnBehalfOf: true,
          },
        },
      },
      expected: TASK_STATUS.COMPLETED,
    },
  ].forEach(({ description, given, expected }) => {
    it(`should have the expected status - ${description}`, () => {
      expect(statusYourDetails(given)).toEqual(expected);
    });
  });
});
