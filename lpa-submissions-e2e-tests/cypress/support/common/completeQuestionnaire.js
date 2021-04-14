import { input, textBox, textArea } from '../PageObjects/common-page-objects';

const uploadFiles = (fileName) => {
  // start watching the POST requests
  cy.server({ method: 'POST' });
  cy.route({
    method: 'POST',
    url: 'upload',
  }).as('upload');

  cy.get('input#documents').attachFile([fileName]);

  cy.wait('@upload', { requestTimeout: 3000 });
  cy.server({ enable: false });
};

const stepCompletion = () => {
  // Accuracy of submission
  cy.goToPage('accuracy-submission');
  input('accurate-submission-no').check();
  textArea('inaccuracy-reason').type(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.',
  );
  cy.clickSaveAndContinue();

  // Extra conditions
  cy.goToPage('extra-conditions');
  input('has-extra-conditions-yes').check();
  textArea('extra-conditions-text').type(
    'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.\n\nSed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.',
  );
  cy.clickSaveAndContinue();

  // Other appeals
  cy.goToPage('other-appeals');
  input('adjacent-appeals-yes').check();
  textBox('appeal-reference-numbers').type('abc-123, def-456');
  cy.clickSaveAndContinue();

  // Plans
  cy.goToPage('plans');
  uploadFiles('upload-file-valid.pdf');
  cy.clickSaveAndContinue();

  // Officers Report
  cy.goToPage('officers-report');
  uploadFiles('upload-file-valid.pdf');
  cy.clickSaveAndContinue();

  // Representation of interested parties
  cy.goToPage('representations');
  uploadFiles('upload-file-valid.pdf');
  cy.clickSaveAndContinue();

  // Notifying interested parties
  cy.goToPage('notifications');
  uploadFiles('upload-file-valid.pdf');
  cy.clickSaveAndContinue();

  // Planning History
  cy.goToPage('planning-history');
  uploadFiles('upload-file-valid.pdf');
  cy.clickSaveAndContinue();

  // Development Plan
  cy.goToPage('development-plan');
  input('has-plan-submitted-yes').check();
  textArea('plan-changes-text').type('mock plan changes');
  cy.clickSaveAndContinue();
};

const apiCompletion = () => {
  // Visit task list page to invoke session, which generates an appeal reply ID
  cy.goToTaskListPage();

  cy.getAppealReplyId().then((replyId) => {
    cy.fixture('completedAppealReply.json').then((reply) => {
      reply.id = replyId;
      cy.request(
        'PUT',
        `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/reply/${replyId}`,
        reply,
      ).then((response) => {
        expect(response.body.aboutAppealSection.submissionAccuracy).to.have.property(
          'accurateSubmission',
          false,
        );
      });
    });
  });
};

module.exports = () => {
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    apiCompletion();
  } else {
    stepCompletion();
  }
};
