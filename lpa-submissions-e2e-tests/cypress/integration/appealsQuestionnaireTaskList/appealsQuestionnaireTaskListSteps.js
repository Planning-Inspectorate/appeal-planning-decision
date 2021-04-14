import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const title =
  'Householder planning appeal questionnaire - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK';
const heading = 'Householder planning appeal questionnaire';
const url = '/task-list';

const visibleWithText = (textToFind, node) => {
  node.invoke('text').then((text) => {
    expect(text).to.contain(textToFind);
  });
};

const tasks = [
  {
    ref: "About the appeal - Review accuracy of the appellant's submission",
    name: 'submissionAccuracy',
    url: '/accuracy-submission',
  },
  {
    ref: 'About the appeal - Do you have any extra conditions?',
    name: 'extraConditions',
    url: '/extra-conditions',
  },
  {
    ref: 'About the appeal - Tell us about any appeals in the immediate area',
    name: 'otherAppeals',
    url: '/other-appeals',
  },
  {
    ref: 'Required documents - Upload the plans used to reach the decision',
    name: 'plansDecision',
    url: '/plans',
  },
  {
    ref: 'Optional supporting documents - Development Plan Document or Neighbourhood Plan',
    name: 'developmentOrNeighbourhood',
    url: '/development-plan',
  },
];

const getTaskDetails = (taskRef) => {
  const task = tasks.find((task) => taskRef === task.ref);

  if (!task) throw new Error(`Unknown task name = ${taskRef}`);

  return task || {};
};

const verifyNotStartedStatus = (taskName) => {
  cy.get('li[' + taskName + '-status="NOT STARTED"]')
    .find('.govuk-tag')
    .contains('NOT STARTED');
};

/**
 * Steps
 * ----------------------------------------------
 */

Given(`The User clicks on {string}`, (taskRef) => {
  const { name, url } = getTaskDetails(taskRef) || {};

  cy.clickOnTaskListLink(name);
  cy.verifyPage(url);
});

//When User clicks on Back button
When(`User clicks on Back button`, () => {
  cy.go('back');
});

Then(`The task {string} is available for selection`, (taskRef) => {
  const { name } = getTaskDetails(taskRef) || {};

  cy.clickOnTaskListLink(name);
});

Then(`The state for {string} is displayed to be "NOT STARTED"`, (taskRef) => {
  const { name } = getTaskDetails(taskRef) || {};

  verifyNotStartedStatus(name);
});

Then('the LPA Planning Officer is taken to the Task List', () => {
  cy.verifyPage(url);
  cy.verifyPageTitle(title);
  cy.verifyPageHeading(heading);
  cy.checkPageA11y();
  visibleWithText(
    'Use the links below to submit your information. You can complete the sections in any order.',
    cy.get('.govuk-body-l'),
  );
  visibleWithText(
    'Only include documents that were considered when making a decision on the application.',
    cy.get('[data-cy="task-list--optionalDocumentsSection"]'),
  );
});

Then(
  'The state for "Before You submit - Check your answers" is displayed to be "CANNOT START YET"',
  () => {
    cy.get('li[checkyouranswers-status="CANNOT START YET"]')
      .find('.govuk-tag')
      .contains('CANNOT START YET');
  },
);

Then(
  'The "Only include documents that were considered when making a decision on the application." is displayed in Optional Supporting Documents',
  () => {
    visibleWithText(
      'Only include documents that were considered when making a decision on the application.',
      cy.get('[data-cy="task-list--optionalDocumentsSection"]'),
    );
  },
);
