const {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
} = require('../../../../../src/services/task-status/task-statuses');
const {
  statusAppealDocumentsSection,
} = require('../../../../../src/services/task-status/full-appeal/status-appeal-documents-section');

describe('services/task-status/full-appeal/status-appeal-documents-section.js', () => {
  describe('#statusAppealDocumentsSection', () => {
    it(`should return NOT_STARTED if 'Your appeal statement' page is NOT_STARTED`, () => {
      const appeal = {
        appealDocumentsSection: {},
        sectionStates: {
          appealDocumentsSection: {
            appealStatement: NOT_STARTED,
          },
        },
      };
      expect(statusAppealDocumentsSection(appeal)).toEqual(NOT_STARTED);
    });
    it('should return COMPLETED if all pages COMPLETED for hasPlansDrawings=false, hasSupportingDocuments=false', () => {
      const appeal = {
        appealDocumentsSection: {
          plansDrawings: {
            hasPlansDrawings: false,
          },
          supportingDocuments: {
            hasSupportingDocuments: false,
          },
        },
        sectionStates: {
          appealDocumentsSection: {
            appealStatement: COMPLETED,
            newPlansDrawings: COMPLETED,
            supportingDocuments: COMPLETED,
          },
        },
      };
      expect(statusAppealDocumentsSection(appeal)).toEqual(COMPLETED);
    });
    it('should return IN_PROGRESS if not all pages COMPLETED for hasPlansDrawings=false, hasSupportingDocuments=false', () => {
      const appeal = {
        appealDocumentsSection: {
          plansDrawings: {
            hasPlansDrawings: false,
          },
          supportingDocuments: {
            hasSupportingDocuments: false,
          },
        },
        sectionStates: {
          appealDocumentsSection: {
            appealStatement: COMPLETED,
            plansDrawings: COMPLETED,
            supportingDocuments: NOT_STARTED,
          },
        },
      };
      expect(statusAppealDocumentsSection(appeal)).toEqual(IN_PROGRESS);
    });
    it('should return COMPLETED if all pages COMPLETED for hasPlansDrawings=true, hasSupportingDocuments=false', () => {
      const appeal = {
        appealDocumentsSection: {
          plansDrawings: {
            hasPlansDrawings: true,
          },
          supportingDocuments: {
            hasSupportingDocuments: false,
          },
        },
        sectionStates: {
          appealDocumentsSection: {
            appealStatement: COMPLETED,
            plansDrawings: COMPLETED,
            newPlansDrawings: COMPLETED,
            supportingDocuments: COMPLETED,
          },
        },
      };
      expect(statusAppealDocumentsSection(appeal)).toEqual(COMPLETED);
    });
    it('should return COMPLETED if all pages COMPLETED for hasPlansDrawings=true, hasSupportingDocuments=true', () => {
      const appeal = {
        appealDocumentsSection: {
          plansDrawings: {
            hasPlansDrawings: true,
          },
          supportingDocuments: {
            hasSupportingDocuments: true,
          },
        },
        sectionStates: {
          appealDocumentsSection: {
            appealStatement: COMPLETED,
            plansDrawings: COMPLETED,
            newPlansDrawings: COMPLETED,
            supportingDocuments: COMPLETED,
            newSupportingDocuments: COMPLETED,
          },
        },
      };
      expect(statusAppealDocumentsSection(appeal)).toEqual(COMPLETED);
    });
  });
});
