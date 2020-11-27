const { VIEW } = require('../../lib/views');

exports.getTaskList = (req, res) => {
  // TODO: derive these values from the current session data
  const applicationStatus = 'Application incomplete';
  const sectionsCompleted = 3;

  res.render(VIEW.APPELLANT_SUBMISSION.TASK_LIST, {
    applicationStatus,
    sectionsCompleted,
    sections: [
      {
        heading: {
          text: 'About you',
        },
        items: [
          {
            text: 'Your details',
            href: '/appellant-submission/who-are-you',
            complete: true,
          },
        ],
      },
      {
        heading: {
          text: 'About the original planning application',
        },
        items: [
          {
            text: 'Planning application number',
            href: 'application-number',
          },
          {
            text: 'Name on original planning application',
            href: 'application-name',
          },
          {
            text: 'Date you applied for planning permission',
            href: 'application-date',
          },
          {
            text: 'Upload the planning application form',
            href: 'upload-application',
          },
          {
            text: 'Changes to the description of the development',
            href: 'upload-application-changes',
          },
        ],
      },
      {
        heading: {
          text: 'About the local planning department',
        },
        items: [
          {
            text: 'Your local planning department',
            href: 'lpa-details',
            complete: true,
          },
          {
            text: 'Upload the decision letter',
            href: 'upload-decision',
            complete: true,
          },
        ],
      },
      {
        heading: {
          text: ' About the appeal site',
        },
        items: [
          {
            text: 'Address of the appeal site',
            href: 'site-location',
          },
          {
            text: 'Access to the appeal site',
            href: 'site-access',
          },
          {
            text: 'Ownership of the appeal site',
            href: 'site-ownership',
          },
        ],
      },
      {
        heading: {
          text: 'Your appeal',
        },
        items: [
          {
            text: 'Your appeal statement',
            href: '/appellant-submission/appeal-statement',
          },
          {
            text: 'Any other documents to support your appeal',
            href: 'supporting-documents',
          },
          {
            text: 'Other relevant appeals',
            href: 'other-appeals',
          },
        ],
      },
      {
        heading: {
          text: 'Submit your appeal',
        },
        items: [
          {
            text: 'Check your answers',
            href: 'check-answers',
          },
        ],
      },
    ],
  });
};
