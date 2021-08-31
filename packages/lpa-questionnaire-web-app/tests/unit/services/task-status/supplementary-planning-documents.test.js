const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const supplementaryPlanningDocumentsCompletion = require('../../../../src/services/task-status/supplementary-planning-documents');

describe('services/task.service/task-status/supplementary-planning-documents', () => {
  [
    {
      title: 'should return null if no appeal reply passed',
      mockAppealReply: undefined,
      result: null,
    },
    {
      title: 'should return not started if uploadedFiles undefined',
      mockAppealReply: {
        optionalDocumentsSection: {
          supplementaryPlanningDocuments: {
            uploadedFiles: undefined,
          },
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        optionalDocumentsSection: {
          supplementaryPlanningDocuments: {
            uploadedFiles: [],
          },
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return completed if uploadedFiles has content',
      mockAppealReply: {
        optionalDocumentsSection: {
          supplementaryPlanningDocuments: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(supplementaryPlanningDocumentsCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
