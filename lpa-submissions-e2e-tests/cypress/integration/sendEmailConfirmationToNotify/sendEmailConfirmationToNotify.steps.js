import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('a confirmation email is sent to the LPA', () => {
  cy.verifyPage('information-submitted');
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.request('GET', `${Cypress.env('EMAIL_NOTIFICATION_URL')}`).then((response) => {
      const lastEmailNotificationOnTheStack = response.body.length - 1;
      const emailNotification = response.body[lastEmailNotificationOnTheStack];
      expect(emailNotification.template_id).to.eq('937b4147-8420-42da-859d-d4a65bdf99bc');
      expect(emailNotification.email_address).to.eq('abby.bale@planninginspectorate.gov.uk');
      expect(emailNotification.personalisation['planning appeal reference']).to.eq(
        '89aa8504-773c-42be-bb68-029716ad9756',
      );
      expect(emailNotification.reference).to.eq(
        '89aa8504-773c-42be-bb68-029716ad9756.SubmissionConfirmation',
      );
      expect(response.status).to.eq(200);
    });
  }
});
