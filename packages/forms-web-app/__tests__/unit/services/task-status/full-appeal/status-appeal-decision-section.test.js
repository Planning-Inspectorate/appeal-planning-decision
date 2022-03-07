const {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../../src/services/task-status/task-statuses');
const {
  statusAppealDecisionSection,
} = require('../../../../../src/services/task-status/full-appeal/status-appeal-decision-section');

describe('services/task-status/full-appeal/status-appeal-decision-section.js', () => {
  describe('#statusAppealDecisionSection', () => {
    it('should return NOT_STARTED if how-decide-appeal page is NOT_STARTED', () => {
      const appeal = {
        appealDecisionSection: {},
        sectionStates: {
          appealDecisionSection: {
            procedureType: NOT_STARTED,
          },
        },
      };
      expect(statusAppealDecisionSection(appeal)).toEqual(NOT_STARTED);
    });
    it('should return COMPLETED if all pages COMPLETED for procedureType=Written Representation', () => {
      const appeal = {
        appealDecisionSection: {
          procedureType: 'Written Representation',
        },
        sectionStates: {
          appealDecisionSection: {
            procedureType: COMPLETED,
          },
        },
      };
      expect(statusAppealDecisionSection(appeal)).toEqual(COMPLETED);
    });
    it('should return IN_PROGRESS if not all pages COMPLETED for procedureType=Hearing', () => {
      const appeal = {
        appealDecisionSection: {
          procedureType: 'Hearing',
        },
        sectionStates: {
          appealDecisionSection: {
            procedureType: COMPLETED,
            hearing: COMPLETED,
            draftStatementOfCommonGround: NOT_STARTED,
          },
        },
      };
      expect(statusAppealDecisionSection(appeal)).toEqual(IN_PROGRESS);
    });
    it('should return COMPLETED if all pages COMPLETED for procedureType=Hearing', () => {
      const appeal = {
        appealDecisionSection: {
          procedureType: 'Hearing',
        },
        sectionStates: {
          appealDecisionSection: {
            procedureType: COMPLETED,
            hearing: COMPLETED,
            draftStatementOfCommonGround: COMPLETED,
          },
        },
      };
      expect(statusAppealDecisionSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for procedureType=Inquiry', () => {
      const appeal = {
        appealDecisionSection: {
          procedureType: 'Inquiry',
        },
        sectionStates: {
          appealDecisionSection: {
            procedureType: COMPLETED,
            inquiry: COMPLETED,
            inquiryExpectedDays: COMPLETED,
            draftStatementOfCommonGround: COMPLETED,
          },
        },
      };
      expect(statusAppealDecisionSection(appeal)).toEqual(COMPLETED);
    });
  });
});
