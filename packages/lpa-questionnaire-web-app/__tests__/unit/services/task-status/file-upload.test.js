const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const fileUploadCompletion = require('../../../../src/services/task-status/file-upload');

describe('services/task.service/task-status/file-upload', () => {
  const mockSection = 'mockSection';
  const mockTaskId = 'mockTaskId';

  [
    {
      title: 'should return null if no appeal reply passed',
      mockAppealReply: undefined,
      result: null,
    },
    {
      title: 'should return not started if section undefined',
      mockAppealReply: {
        mockSection: undefined,
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if taskId undefined',
      mockAppealReply: {
        mockSection: {},
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        mockSection: {
          mockTaskId: {
            uploadedFiles: [],
          },
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return completed if uploadedFiles has content',
      mockAppealReply: {
        mockSection: {
          mockTaskId: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(fileUploadCompletion(mockAppealReply, mockTaskId, mockSection)).toEqual(result);
    });
  });
});
