import { Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPage } from '../../../../support/common/verifyPage';
import { checkSubmissionPdfContent } from '../../../../support/common/pdfFunctions';

Then('a PDF of the Check Your Answers page is created', () => {
  verifyPage('information-submitted');

  downloadSubmissionPdf().then(() => {
    checkSubmissionPdfContent('Bob Smith');
    checkSubmissionPdfContent('1 Taylor Road');
    checkSubmissionPdfContent(
      'Does the information from the appellant accurately reflect the original planning application?',
    );
    checkSubmissionPdfContent(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
    );
    checkSubmissionPdfContent('Submitted to the Planning Inspectorate on');
  });
});
