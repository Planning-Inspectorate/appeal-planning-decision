import { Then } from 'cypress-cucumber-preprocessor/steps';
import getNotificationEmail from '../../../../support/common/getNotificationEmail';

Then('a confirmation email is sent to the LPA', () => {
  cy.verifyPage('information-submitted');
  cy.get('@appeal').then((appeal) => {
    getNotificationEmail().then((response) => {
      const lastEmailNotificationOnTheStack = response.body.length - 1;
      const emailNotification = response.body[lastEmailNotificationOnTheStack];
      expect(emailNotification.template_id).to.eq('937b4147-8420-42da-859d-d4a65bdf99bc');
      expect(emailNotification.email_address).to.eq(
        'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
      );

      expect(Object.keys(emailNotification.personalisation).length).to.eq(4);
      expect(emailNotification.personalisation['Planning appeal number']).to.eq(appeal.horizonId);
      expect(emailNotification.personalisation['Name of local planning department']).to.eq(
        'System Test Borough Council',
      );
      expect(emailNotification.personalisation['Planning application number']).to.eq(
        appeal.requiredDocumentsSection.applicationNumber,
      );

      expect(
        Object.keys(emailNotification.personalisation['link to appeal questionnaire pdf']).length,
      ).to.eq(2);
      expect(
        emailNotification.personalisation['link to appeal questionnaire pdf'].file.length,
      ).to.be.gt(1);
      expect(emailNotification.personalisation['link to appeal questionnaire pdf'].is_csv).to.eq(
        false,
      );

      expect(emailNotification.reference).to.eq(`${appeal.id}.SubmissionConfirmation`);
      expect(emailNotification.email_reply_to_id).to.eq('f1e6c8c5-786e-41ca-9086-10b67f31bc86');
      expect(response.status).to.eq(200);
    });
  });
});
