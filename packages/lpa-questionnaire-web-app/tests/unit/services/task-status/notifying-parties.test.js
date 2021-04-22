const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const notifyingPartiesCompletion = require('../../../../src/services/task-status/notifying-parties');

describe('services/task.service/task-status/notifying-parties', () => {
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
          interestedPartiesAppeal: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        optionalDocumentsSection: {
          interestedPartiesAppeal: {
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
          interestedPartiesAppeal: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(notifyingPartiesCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
