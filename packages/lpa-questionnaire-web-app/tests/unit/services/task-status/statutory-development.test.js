const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const statutoryDevelopmentCompletion = require('../../../../src/services/task-status/statutory-development');

describe('services/task.service/task-status/statutory-development', () => {
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
          statutoryDevelopment: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        optionalDocumentsSection: {
          statutoryDevelopment: {
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
          statutoryDevelopment: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(statutoryDevelopmentCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
