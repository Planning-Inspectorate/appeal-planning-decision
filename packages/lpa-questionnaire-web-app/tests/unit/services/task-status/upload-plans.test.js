const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const uploadPlansCompletion = require('../../../../src/services/task-status/upload-plans');

describe('services/task.service/task-status/upload-plans', () => {
  [
    {
      title: 'should return null if no appeal reply passed',
      mockAppealReply: undefined,
      result: null,
    },
    {
      title: 'should return not started if uploadedFiles undefined',
      mockAppealReply: {
        requiredDocumentsSection: {
          plansDecision: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        requiredDocumentsSection: {
          plansDecision: {
            uploadedFiles: [],
          },
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return completed if uploadedFiles has content',
      mockAppealReply: {
        requiredDocumentsSection: {
          plansDecision: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(uploadPlansCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
