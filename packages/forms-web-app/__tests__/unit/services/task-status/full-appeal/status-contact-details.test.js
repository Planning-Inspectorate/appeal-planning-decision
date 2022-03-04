const {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../../src/services/task-status/task-statuses');
const {
  statusContactDetails,
} = require('../../../../../src/services/task-status/full-appeal/status-contact-details');

describe('services/task-status/full-appeal/status-contact-details.js', () => {
  describe('#statusContactDetails', () => {
    it('should return NOT_STARTED if originial applicant page is NOT_STARTED', () => {
      const appeal = {
        contactDetailsSection: {
          isOriginalApplicant: true,
        },
        sectionStates: {
          contactDetailsSection: {
            isOriginalApplicant: NOT_STARTED,
            contact: NOT_STARTED,
          },
        },
      };
      expect(statusContactDetails(appeal)).toEqual(NOT_STARTED);
    });
    it('should return IN_PROGRESS if original applicant and not all sections[isOriginalApplicant, contact] COMPLETED', () => {
      const appeal = {
        contactDetailsSection: {
          isOriginalApplicant: true,
        },
        sectionStates: {
          contactDetailsSection: {
            isOriginalApplicant: COMPLETED,
            contact: NOT_STARTED,
          },
        },
      };
      expect(statusContactDetails(appeal)).toEqual(IN_PROGRESS);
    });
    it('should return COMPLETED if original applicant and sections[isOriginalApplicant, contact] COMPLETED', () => {
      const appeal = {
        contactDetailsSection: {
          isOriginalApplicant: true,
        },
        sectionStates: {
          contactDetailsSection: {
            isOriginalApplicant: COMPLETED,
            contact: COMPLETED,
          },
        },
      };
      expect(statusContactDetails(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if not original applicant and sections[isOriginalApplicant, appealingOnBehalfOf, contact] COMPLETED', () => {
      const appeal = {
        contactDetailsSection: {
          isOriginalApplicant: false,
        },
        sectionStates: {
          contactDetailsSection: {
            isOriginalApplicant: COMPLETED,
            appealingOnBehalfOf: COMPLETED,
            contact: COMPLETED,
          },
        },
      };
      expect(statusContactDetails(appeal)).toEqual(COMPLETED);
    });
  });
});
