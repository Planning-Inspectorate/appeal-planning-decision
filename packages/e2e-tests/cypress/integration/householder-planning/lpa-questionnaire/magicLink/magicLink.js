import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {verifyPage} from '../../../../support/common/verifyPage';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import {
  inputEmailAddress
} from '../../../../support/householder-planning/lpa-questionnaire/magic-link/inputEmailAddress';
import { clickSubmitButton } from '../../../../support/common/clickSubmitButton';
import { createAuthToken } from '../../../../support/householder-planning/lpa-questionnaire/magic-link/createAuthToken';
import { authenticateLPA } from '../../../../support/householder-planning/lpa-questionnaire/magic-link/authenticateLPA';
import { getMagicLink } from '../../../../support/householder-planning/lpa-questionnaire/magic-link/getMagicLink';
import { clickLink } from '../../../../support/common/clickLink';
import { hasLink } from '../../../../support/common/hasLink';
import { verifyNotificationBanner } from '../../../../support/common/verifyNotificationBanner';
import { validateErrorMessage } from '../../../../support/common/validateErrorMessage';


const lpaCode = 'E69999999';
const enterEmailAddressLink = 'authentication/your-email';
const confirmEmailAddressLink = 'authentication/confirm-email';
const questionnaireTaskListPage = 'task-list';
const lpaName = 'System Test Borough Council';

Given('LPA wants to access a questionnaire', () => {
  // nothing to do here
});

Given('the LPA is on the confirm your email page', () => {
  goToPage(confirmEmailAddressLink, lpaCode);
});

Given('LPA user receives a magic link for accessing the questionnaire', () => {
  goToPage(questionnaireTaskListPage);
  inputEmailAddress();
  clickSubmitButton();
});

And('is trying to access the LPA questionnaire', () => {
  // This is for information purpose only
});

Given('access to the questionnaire is requested', () => {
  goToPage(questionnaireTaskListPage);
});

Given('LPA user wants to have the magic link resent to them', () => {
  goToPage(confirmEmailAddressLink, lpaCode);
});

Given('the session has timed out', () => {
  const tokenExpirationTime = new Date();
  tokenExpirationTime.setHours(tokenExpirationTime.getHours() - 4); // 4h ago
  const expiredAuthToken = createAuthToken(tokenExpirationTime.getTime());

  cy.setCookie(Cypress.env('AUTH_COOKIE_NAME'), expiredAuthToken);
});

Given('LPA Planning Officer wants to access a questionnaire', () => {
  // nothing to do here
});

Given('the LPA Planning Officer has not been authenticated', () => {
  cy.clearCookies();
});

Given('the LPA Planning Officer is authenticated', () => {
  authenticateLPA();
});

When('they click on the start questionnaire link in the initial email', () => {
  goToPage(questionnaireTaskListPage);
});

When('the email address does not match the domain of the LPA from the appeal', () => {
  inputEmailAddress('test@test.gov.uk');
  clickSubmitButton();
});

When('an email address is not provided', () => {
  inputEmailAddress('');
  clickSubmitButton();
});

When('the email address provided in not in the correct format', () => {
  inputEmailAddress('invalidEmailAddress');
  clickSubmitButton();
});

When('a valid email address is provided matching the domain of the LPA', () => {
  inputEmailAddress();
  clickSubmitButton();
});

When('they select to email the customer support team', () => {
  // nothing to do here
});

When('they select a valid link', () => {
  getMagicLink().then((magicLink) => cy.wrap(magicLink).as('magicLink'));
});

When('they select the expired magic link', () => {
  goToPage(`${enterEmailAddressLink}/link-expired`, lpaCode);
});

When('they select ‘resend the email’', () => {
  clickLink('resend-email-link');
});

When('the LPA tries to access the questionnaire', () => {
  goToPage(questionnaireTaskListPage);
});

Then('enter email address page will be opened in the browser', () => {
  verifyPage(enterEmailAddressLink);
});

Then('enter email address page will be displayed', () => {
  verifyPage(enterEmailAddressLink);
});

Then('a magic link is sent to that email address via Notify', () => {
  getMagicLink().then((magicLink) => {
    assert.exists(magicLink);
  });
});

Then('a mailto link will be provided', () => {
  hasLink(
    '[data-cy="customer-support-mailto-link"]',
    'mailto:enquiries@planninginspectorate.gov.uk',
  );
});

Then('the questionnaire page is presented', () => {
  verifyPage(questionnaireTaskListPage);
});

Then('they are redirected to the questionnaire page', () => {
  cy.get('@magicLink').then((magicLink) => {
    cy.request({
      url: magicLink,
      followRedirect: false,
    }).then((resp) => {
      expect(resp.status).to.eq(302);
      expect(resp.redirectedToUrl).to.contain(questionnaireTaskListPage);
    });
  });
});

And('a session expired notification banner is displayed on the page', () => {
  verifyPage(`${enterEmailAddressLink}/session-expired`);

  const title = 'Session expired';
  const body = `To return to the questionnaire, you need to enter your ${lpaName} email address`;
  const heading = 'Your session has timed out';

  verifyNotificationBanner('session-expired-notification', title, heading, body);
});

And('a link expired notification banner is displayed on the page', () => {
  verifyPage(`${enterEmailAddressLink}/link-expired`);

  const title = 'Link expired';
  const body = `To get a new link, you need to enter your ${lpaName} email address.`;
  const heading = 'Your link has expired';

  verifyNotificationBanner('link-expired-notification', title, heading, body);
});

Then('progress is made to the confirm your email address page', () => {
  verifyPage(confirmEmailAddressLink);
});

And('a magic link is not sent to the user', () => {
  getMagicLink().then((magicLink) => expect(magicLink).to.be.null);
});

Then('progress is halted with an error message to {string}', (errorMessage) => {
  verifyPage(enterEmailAddressLink);
  validateErrorMessage(errorMessage, 'a[href="#email"]', 'email');
});
