const link = 'https://www.smartsurvey.co.uk/s/GHUFVZ/'
const selector = '[data-cy="Feedback"]';

Given('the LPA Questionnaire is accessed', () => {
  cy.goToTaskListPage();
  cy.hasLink(selector, link);
});

When('the feedback link is selected', () => {
  cy.get(selector).click();
});

Then('the feedback survey is presented', () => {
  cy.verifyPage(link)
});
