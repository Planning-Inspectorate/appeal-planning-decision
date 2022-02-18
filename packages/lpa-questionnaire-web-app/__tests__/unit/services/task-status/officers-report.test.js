const { NOT_STARTED, COMPLETED } = require('../../../../src/services/common/task-statuses');
const officersReportCompletion = require('../../../../src/services/task-status/officers-report');

describe('services/task.service/task-status/officers-report', () => {
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
          officersReport: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        requiredDocumentsSection: {
          officersReport: {
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
          officersReport: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(officersReportCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
