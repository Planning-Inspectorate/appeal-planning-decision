import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('a PDF of the Check Your Answers page is created', () => {
  cy.verifyPage('information-submitted');

  cy.downloadSubmissionPdf().then(() => {
    cy.checkSubmissionPdfContent('Bob Smith');
    cy.checkSubmissionPdfContent('1 Taylor Road');
    cy.checkSubmissionPdfContent(
      'Does the information from the appellant accurately reflect the original planning application?',
    );
    cy.checkSubmissionPdfContent(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
    );
    cy.checkSubmissionPdfContent('Submitted to the Planning Inspectorate on');
  });
});
