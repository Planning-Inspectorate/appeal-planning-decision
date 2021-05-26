const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');
const conservationAreaMapCompletion = require('../../../../src/services/task-status/conservation-area-map');

describe('services/task.service/task-status/conservation-area-map', () => {
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
          conservationAreaMap: {},
        },
      },
      result: NOT_STARTED,
    },
    {
      title: 'should return not started if uploadedFiles empty',
      mockAppealReply: {
        optionalDocumentsSection: {
          conservationAreaMap: {
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
          conservationAreaMap: {
            uploadedFiles: [{ name: 'mock-file' }],
          },
        },
      },
      result: COMPLETED,
    },
  ].forEach(({ title, mockAppealReply, result }) => {
    it(title, () => {
      expect(conservationAreaMapCompletion(mockAppealReply)).toEqual(result);
    });
  });
});
