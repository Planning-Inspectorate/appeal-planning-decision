/* eslint-disable global-require */
const { NOT_STARTED, COMPLETED } = require('../../../../src/services/task-status/task-statuses');

describe('services/task.service/task-status/boolean', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return null if no appeal reply passed', () => {
    const booleanCompletion = require('../../../../src/services/task-status/boolean');
    expect(booleanCompletion()).toBeNull();
  });

  it('should return not started if not set', () => {
    jest.doMock('../../../../src/lib/questionTypes', () => ({
      booleanQuestions: [
        {
          id: 'mockTask',
        },
      ],
    }));

    const booleanCompletion = require('../../../../src/services/task-status/boolean');

    const mockAppealReply = {
      mockTask: null,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(NOT_STARTED);
  });

  it('should return not started if undefined', () => {
    jest.doMock('../../../../src/lib/questionTypes', () => ({
      booleanQuestions: [
        {
          id: 'mockTask',
          text: {
            id: 'mockTextId',
            parentValue: false,
          },
        },
      ],
    }));

    const booleanCompletion = require('../../../../src/services/task-status/boolean');

    const mockAppealReply = {
      mockTask: undefined,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(NOT_STARTED);
  });

  it('should return completed if answer is yes (basic boolean)', () => {
    jest.doMock('../../../../src/lib/questionTypes', () => ({
      booleanQuestions: [
        {
          id: 'mockTask',
        },
      ],
    }));

    const booleanCompletion = require('../../../../src/services/task-status/boolean');

    const mockAppealReply = {
      mockTask: true,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(COMPLETED);
  });

  it('should return completed if answer is no  (basic boolean)', () => {
    jest.doMock('../../../../src/lib/questionTypes', () => ({
      booleanQuestions: [
        {
          id: 'mockTask',
        },
      ],
    }));

    const booleanCompletion = require('../../../../src/services/task-status/boolean');

    const mockAppealReply = {
      mockTask: false,
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(COMPLETED);
  });

  it('should return completed if answer is yes and text passed (boolean w/ text)', () => {
    jest.doMock('../../../../src/lib/questionTypes', () => ({
      booleanQuestions: [
        {
          id: 'mockTask',
          text: {
            id: 'mockTextId',
            parentValue: true,
          },
        },
      ],
    }));

    const booleanCompletion = require('../../../../src/services/task-status/boolean');

    const mockAppealReply = {
      mockTask: {
        value: true,
        mockTextId: 'mock value',
      },
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(COMPLETED);
  });

  it('should return completed if answer is no (boolean w/ text)', () => {
    jest.doMock('../../../../src/lib/questionTypes', () => ({
      booleanQuestions: [
        {
          id: 'mockTask',
          dataId: 'mockTaskId',
          text: {
            id: 'mockTextId',
            parentValue: true,
          },
        },
      ],
    }));

    const booleanCompletion = require('../../../../src/services/task-status/boolean');

    const mockAppealReply = {
      mockTask: {
        mockTaskId: false,
        mockTextId: '',
      },
    };

    expect(booleanCompletion(mockAppealReply, 'mockTask')).toEqual(COMPLETED);
  });
});
