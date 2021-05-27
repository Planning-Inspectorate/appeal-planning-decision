const checkAnswersSections = require('../../../src/lib/check-answers-sections');

jest.mock('../../../src/services/task.service', () => ({
  __esModule: true,
  SECTIONS: [
    {
      sectionId: 'mockSection',
      tasks: [
        {
          taskId: 'mockTask1',
          href: '/mock-task-1',
          rule: () => 'NOT STARTED',
        },
        {
          taskId: 'mockTask2',
          href: '/mock-task-2',
          rule: () => 'NOT STARTED',
        },
      ],
    },
  ],
  CHECK_ANSWERS: {
    mockTask2: 'Different mock title',
  },
  HEADERS: {
    mockSection: 'Mock Section',
    mockTask1: 'Mock Task 1',
  },
}));

describe('check-answers-sections', () => {
  [
    {
      title: 'Shows no answer found if no results',
      taskValue: null,
      output: { text: 'No answer found' },
    },
    {
      title: 'Returns no files uploaded if uploaded files key present but empty',
      taskValue: {
        uploadedFiles: [],
      },
      output: { html: '<p>No files uploaded</p>' },
    },
    {
      title: 'Shows file list if uploaded files key present and not empty',
      taskValue: {
        uploadedFiles: [{ name: 'mock-file.pdf', id: 'abc-123' }],
      },
      output: { html: '<ul class="govuk-list"><li>mock-file.pdf</li></ul>' },
    },
    {
      title: 'Returns empty string if value of field is empty string',
      taskValue: {
        mockValue: '',
      },
      output: { html: '' },
    },
    {
      title: 'Shows Yes if boolean value true provided directly',
      taskValue: true,
      output: { html: '<p>Yes</p>' },
    },
    {
      title: 'Shows Yes if boolean value true provided',
      taskValue: {
        mockValue: true,
      },
      output: { html: '<p>Yes</p>' },
    },
    {
      title: 'Shows No if boolean value false provided',
      taskValue: {
        mockValue: false,
      },
      output: { html: '<p>No</p>' },
    },
    {
      title: 'Shows value if string is provided',
      taskValue: {
        mockValue: 'mock value',
      },
      output: { html: '<p>mock value</p>' },
    },
  ].forEach(({ title, taskValue, output }) => {
    it(title, () => {
      const appealReply = {
        mockSection: {
          mockTask1: taskValue,
        },
      };

      expect(checkAnswersSections(appealReply, 'mock-id')).toEqual([
        {
          id: 'mockSection',
          heading: 'Mock Section',
          subTasks: [
            {
              key: { text: 'Mock Task 1' },
              value: {
                ...output,
                classes: 'test__mockTask1--answer',
              },
              actions: {
                items: [
                  {
                    href: '/mock-id/mock-task-1',
                    text: 'Change',
                    visuallyHiddenText: 'Mock Task 1',
                    attributes: {
                      'data-cy': 'mockTask1',
                    },
                  },
                ],
              },
            },
            {
              key: { text: 'Different mock title' },
              value: {
                text: 'No answer found',
                classes: 'test__mockTask2--answer',
              },
              actions: {
                items: [
                  {
                    href: '/mock-id/mock-task-2',
                    text: 'Change',
                    visuallyHiddenText: 'Different mock title',
                    attributes: {
                      'data-cy': 'mockTask2',
                    },
                  },
                ],
              },
            },
          ],
        },
      ]);
    });
  });

  it('Hides actions if showActions is false', () => {
    const appealReply = {
      mockSection: {
        mockTask1: null,
      },
    };

    expect(checkAnswersSections(appealReply, 'mock-id', false)).toEqual([
      {
        id: 'mockSection',
        heading: 'Mock Section',
        subTasks: [
          {
            key: { text: 'Mock Task 1' },
            value: {
              text: 'No answer found',
              classes: 'test__mockTask1--answer',
            },
          },
          {
            key: { text: 'Different mock title' },
            value: {
              text: 'No answer found',
              classes: 'test__mockTask2--answer',
            },
          },
        ],
      },
    ]);
  });
});
