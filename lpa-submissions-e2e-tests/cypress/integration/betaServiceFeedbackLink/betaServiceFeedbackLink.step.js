const link = 'https://www.smartsurvey.co.uk/s/GHUFVZ/'
const dataCyId = 'Feedback';

Given('the LPA Questionnaire is accessed', () => {
  cy.goToTaskListPage();
  cy.hasLink(dataCyId, link);
});

When('the feedback link is selected', () => {
  cy.clickDataCyElement(dataCyId);
});

Then('the feedback survey is presented', () => {
  cy.verifyPage(link)
});
