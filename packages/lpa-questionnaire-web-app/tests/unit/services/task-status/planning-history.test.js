const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const planningHistoryCompletion = require('../../../../src/services/task-status/planning-history');

describe('services/task.service/task-status/planning-history', () => {
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
          planningHistory: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        optionalDocumentsSection: {
          planningHistory: {
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
          planningHistory: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(planningHistoryCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
