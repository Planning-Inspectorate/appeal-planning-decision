const {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../../src/services/task-status/task-statuses');
const {
  statusPlanningApplicationDocumentsSection,
} = require('../../../../../src/services/task-status/full-appeal/status-planning-application-documents-section');

describe('services/task-status/full-appeal/status-planning-application-documents-section.js', () => {
  describe('#statusPlanningApplicationDocumentsSection', () => {
    it('should return NOT_STARTED if Planning application form page is NOT_STARTED', () => {
      const appeal = {
        planningApplicationDocumentsSection: {},
        sectionStates: {
          planningApplicationDocumentsSection: {
            originalApplication: NOT_STARTED,
          },
        },
      };
      expect(statusPlanningApplicationDocumentsSection(appeal)).toEqual(NOT_STARTED);
    });
    it('should return COMPLETED if all pages COMPLETED for designAccessStatement.isSubmitted=false', () => {
      const appeal = {
        planningApplicationDocumentsSection: {
          designAccessStatement: {
            isSubmitted: false,
          },
        },
        sectionStates: {
          planningApplicationDocumentsSection: {
            originalApplication: COMPLETED,
            applicationNumber: COMPLETED,
            plansDrawingsSupportingDocuments: COMPLETED,
            designAccessStatementSubmitted: COMPLETED,
            decisionLetter: COMPLETED,
          },
        },
      };
      expect(statusPlanningApplicationDocumentsSection(appeal)).toEqual(COMPLETED);
    });
    it('should return IN_PROGRESS if not all pages COMPLETED for designAccessStatement.isSubmitted=false', () => {
      const appeal = {
        planningApplicationDocumentsSection: {
          designAccessStatement: {
            isSubmitted: false,
          },
        },
        sectionStates: {
          planningApplicationDocumentsSection: {
            originalApplication: COMPLETED,
            applicationNumber: COMPLETED,
            plansDrawingsSupportingDocuments: COMPLETED,
            designAccessStatementSubmitted: COMPLETED,
            decisionLetter: NOT_STARTED,
          },
        },
      };
      expect(statusPlanningApplicationDocumentsSection(appeal)).toEqual(IN_PROGRESS);
    });
    it('should return COMPLETED if all pages COMPLETED for designAccessStatement.isSubmitted=true', () => {
      const appeal = {
        planningApplicationDocumentsSection: {
          designAccessStatement: {
            isSubmitted: true,
          },
        },
        sectionStates: {
          planningApplicationDocumentsSection: {
            originalApplication: COMPLETED,
            applicationNumber: COMPLETED,
            plansDrawingsSupportingDocuments: COMPLETED,
            designAccessStatementSubmitted: COMPLETED,
            decisionLetter: COMPLETED,
            designAccessStatement: COMPLETED,
          },
        },
      };
      expect(statusPlanningApplicationDocumentsSection(appeal)).toEqual(COMPLETED);
    });
  });
});
